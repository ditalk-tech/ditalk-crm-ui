<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="ID" prop="id">
              <el-input v-model="queryParams.id" placeholder="请输入ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="创建时间" style="width: 308px">
              <el-date-picker
                v-model="dateRangeCreateTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
              />
            </el-form-item>
            <el-form-item label="客户名称" prop="name">
              <el-input v-model="queryParams.name" placeholder="请输入客户名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="客户类型" prop="type">
              <el-select v-model="queryParams.type" placeholder="请选择客户类型" clearable>
                <el-option v-for="dict in ditalk_customer_type" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="来源渠道" prop="source">
              <el-select v-model="queryParams.source" placeholder="请选择来源渠道" clearable filterable>
                <el-option v-for="dict in ditalk_customer_source" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="所属行业" prop="industry">
              <el-select v-model="queryParams.industry" placeholder="请选择所属行业" clearable filterable>
                <el-option v-for="dict in ditalk_customer_industry" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="客户级别" prop="tier">
              <el-select v-model="queryParams.tier" placeholder="请选择客户级别" clearable filterable>
                <el-option v-for="dict in ditalk_customer_tier" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="地址" prop="address">
              <el-input v-model="queryParams.address" placeholder="请输入地址" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="分配到" prop="assignedTo">
              <!-- <el-input v-model="queryParams.assignedTo" placeholder="请输入分配到" clearable @keyup.enter="handleQuery" /> -->
              <el-select v-model="queryParams.assignedTo" placeholder="请选择用户" filterable clearable>
                <el-option
                  v-for="item in userOptionList"
                  :key="item.userId"
                  :label="item.userName + ' - ' + item.nickName"
                  :value="item.userId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="主联系人ID" prop="contactId">
              <el-input v-model="queryParams.contactId" placeholder="请输入主联系人ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="客户状态" prop="state">
              <el-select v-model="queryParams.state" placeholder="请选择客户状态" clearable>
                <el-option v-for="dict in ditalk_customer_state" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="转换时间" prop="convertedTime">
              <el-date-picker clearable v-model="queryParams.convertedTime" type="date" value-format="YYYY-MM-DD" placeholder="请选择转换时间" />
            </el-form-item>
            <el-form-item label="转换人" prop="convertedBy">
              <el-input v-model="queryParams.convertedBy" placeholder="请输入转换人" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="线索状态" prop="leadState">
              <el-select v-model="queryParams.leadState" placeholder="请选择线索状态" clearable>
                <el-option v-for="dict in ditalk_lead_state" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['lead:info:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['lead:info:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['lead:info:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['lead:info:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="infoList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" fixed="left" />
        <el-table-column label="ID" align="center" prop="id" v-if="true" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180" />
        <el-table-column label="客户名称" align="center" prop="name" />
        <el-table-column label="客户类型" align="center" prop="type">
          <template #default="scope">
            <dict-tag :options="ditalk_customer_type" :value="scope.row.type" />
          </template>
        </el-table-column>
        <el-table-column label="来源渠道" align="center" prop="source" width="120">
          <template #default="scope">
            <dict-tag :options="ditalk_customer_source" :value="scope.row.source ?? ''" />
          </template>
        </el-table-column>
        <el-table-column label="所属行业" align="center" prop="industry" width="120">
          <template #default="scope">
            <dict-tag :options="ditalk_customer_industry" :value="scope.row.industry ?? ''" />
          </template>
        </el-table-column>
        <el-table-column label="客户级别" align="center" prop="tier" width="120">
          <template #default="scope">
            <dict-tag :options="ditalk_customer_tier" :value="scope.row.tier ?? ''" />
          </template>
        </el-table-column>
        <el-table-column label="公司官网" align="center" prop="website" />
        <el-table-column label="地址" align="center" prop="address" />
        <el-table-column label="分配到" align="center" prop="assignedTo" />
        <el-table-column label="备注信息" align="center" prop="remark" />
        <el-table-column label="主联系人ID" align="center" prop="contactId" />
        <el-table-column label="客户状态" align="center" prop="state">
          <template #default="scope">
            <dict-tag :options="ditalk_customer_state" :value="scope.row.state" />
          </template>
        </el-table-column>
        <el-table-column label="转换时间" align="center" prop="convertedTime" width="180" />
        <el-table-column label="转换人" align="center" prop="convertedBy" />
        <el-table-column label="线索状态" align="center" prop="leadState">
          <template #default="scope">
            <dict-tag :options="ditalk_lead_state" :value="scope.row.leadState" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['lead:info:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['lead:info:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改线索信息对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="960px" append-to-body>
      <el-form ref="infoFormRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="客户名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="客户类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio v-for="dict in ditalk_customer_type" :key="dict.value" :value="dict.value">{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="来源渠道" prop="source">
          <el-select v-model="form.source" placeholder="请选择来源渠道" filterable clearable>
            <el-option v-for="dict in ditalk_customer_source" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属行业" prop="industry">
          <el-select v-model="form.industry" placeholder="请选择所属行业" filterable clearable>
            <el-option v-for="dict in ditalk_customer_industry" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户级别" prop="tier">
          <el-select v-model="form.tier" placeholder="请选择客户级别" filterable clearable>
            <el-option v-for="dict in ditalk_customer_tier" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公司官网" prop="website">
          <el-input v-model="form.website" placeholder="请输入公司官网" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="分配到" prop="assignedTo">
          <el-select v-model="form.assignedTo" placeholder="请选择用户" filterable clearable style="width: 70%">
            <el-option
              v-for="item in userOptionList"
              :key="item.userId"
              :label="item.userName + ' - ' + item.nickName"
              :value="item.userId"
            ></el-option>
          </el-select>
          <el-button @click="assignToMe" type="info" plain>给 我</el-button>
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="主联系人ID" prop="contactId">
          <el-input v-model="form.contactId" placeholder="请输入主联系人ID" />
        </el-form-item>
        <el-form-item label="客户状态" prop="state">
          <el-radio-group v-model="form.state">
            <el-radio v-for="dict in ditalk_customer_state" :key="dict.value" :value="dict.value">{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="转换时间" prop="convertedTime">
          <el-date-picker clearable v-model="form.convertedTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择转换时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="转换人" prop="convertedBy">
          <el-input v-model="form.convertedBy" placeholder="请输入转换人" />
        </el-form-item>
        <el-form-item label="线索状态" prop="leadState">
          <el-radio-group v-model="form.leadState">
            <el-radio v-for="dict in ditalk_lead_state" :key="dict.value" :value="dict.value">{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Info" lang="ts">
import { listInfo, getInfo, delInfo, addInfo, updateInfo } from '@/api/lead/info';
import { InfoVO, InfoQuery, InfoForm } from '@/api/lead/info/types';
import { listOption, getMyInfo } from '@/api/app/sys/user';
import { UserOption } from '@/api/app/sys/user/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { ditalk_customer_source, ditalk_customer_industry, ditalk_lead_state, ditalk_customer_state, ditalk_customer_type, ditalk_customer_tier } =
  toRefs<any>(
    proxy?.useDict(
      'ditalk_customer_source',
      'ditalk_customer_industry',
      'ditalk_lead_state',
      'ditalk_customer_state',
      'ditalk_customer_type',
      'ditalk_customer_tier'
    )
  );

const infoList = ref<InfoVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const dateRangeCreateTime = ref<[DateModelType, DateModelType]>(['', '']);

const queryFormRef = ref<ElFormInstance>();
const infoFormRef = ref<ElFormInstance>();
const userOptionList = ref<UserOption[]>([]);

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: InfoForm = {
  id: undefined,
  version: undefined,
  name: undefined,
  type: undefined,
  source: undefined,
  industry: undefined,
  tier: undefined,
  website: undefined,
  address: undefined,
  assignedTo: undefined,
  remark: undefined,
  contactId: undefined,
  state: 'ACTIVE',
  convertedTime: undefined,
  convertedBy: undefined,
  leadState: 'NEW'
};
const data = reactive<PageData<InfoForm, InfoQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    id: undefined,
    name: undefined,
    type: undefined,
    source: undefined,
    industry: undefined,
    tier: undefined,
    address: undefined,
    assignedTo: undefined,
    contactId: undefined,
    state: undefined,
    convertedTime: undefined,
    convertedBy: undefined,
    leadState: undefined,
    params: {
      createTime: undefined
    }
  },
  rules: {
    id: [{ required: true, message: 'ID不能为空', trigger: 'blur' }],
    name: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
    type: [{ required: true, message: '客户类型不能为空', trigger: 'change' }],
    contactId: [{ required: true, message: '主联系人ID不能为空', trigger: 'blur' }],
    state: [{ required: true, message: '客户状态不能为空', trigger: 'change' }],
    leadState: [{ required: true, message: '线索状态不能为空', trigger: 'change' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询线索信息列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.params = {};
  proxy?.addDateRange(queryParams.value, dateRangeCreateTime.value, 'CreateTime');
  const res = await listInfo(queryParams.value);
  infoList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  infoFormRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  dateRangeCreateTime.value = ['', ''];
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: InfoVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加线索信息';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: InfoVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getInfo(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改线索信息';
};

/** 提交按钮 */
const submitForm = () => {
  infoFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateInfo(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addInfo(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: InfoVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除线索信息编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delInfo(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'lead/info/export',
    {
      ...queryParams.value
    },
    `info_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getUserOptionList();
  getList();
});

const getUserOptionList = async () => {
  await listOption({
    pageNum: 1,
    pageSize: 100
  }).then((res: { data: any }) => {
    userOptionList.value = res.data;
  });
};

const assignToMe = () => {
  getMyInfo().then((res) => {
    form.value.assignedTo = Number(res.data.userId);
  });
};
</script>
