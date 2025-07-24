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
            <el-form-item label="商机标题" prop="title">
              <el-input v-model="queryParams.title" placeholder="请输入商机标题" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="客户ID" prop="customerId">
              <el-input v-model="queryParams.customerId" placeholder="请输入客户ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="指派给" prop="assignedTo">
              <el-input v-model="queryParams.assignedTo" placeholder="请输入指派给" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="预计成交日期" style="width: 308px">
              <el-date-picker
                v-model="dateRangeCloseDate"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
              />
            </el-form-item>
            <el-form-item label="商机阶段" prop="state">
              <el-select v-model="queryParams.state" placeholder="请选择商机阶段" clearable>
                <el-option v-for="dict in ditalk_opportunity_state" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="关联订单ID" prop="orderId">
              <el-input v-model="queryParams.orderId" placeholder="请输入订单ID" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['opportunity:info:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['opportunity:info:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['opportunity:info:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['opportunity:info:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="infoList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" fixed="left" />
        <el-table-column label="ID" align="center" prop="id" v-if="true" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180" />
        <el-table-column label="商机标题" align="center" prop="title" />
        <el-table-column label="客户ID" align="center" prop="customerId" />
        <el-table-column label="指派给" align="center" prop="assignedTo" />
        <el-table-column label="预计销售金额" align="center" prop="amount" />
        <el-table-column label="预计成交日期" align="center" prop="closeDate" width="180" />
        <!-- <el-table-column label="备注信息" align="center" prop="remark" /> -->
        <el-table-column label="商机阶段" align="center" prop="state">
          <template #default="scope">
            <dict-tag :options="ditalk_opportunity_state" :value="scope.row.state" />
          </template>
        </el-table-column>
        <el-table-column label="关联订单ID" align="center" prop="orderId" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['opportunity:info:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['opportunity:info:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改商机信息对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="960px" append-to-body>
      <el-form ref="infoFormRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="商机标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入商机标题" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="客户" prop="customerId">
              <!-- <el-input v-model="form.customerId" placeholder="请输入客户ID" /> -->
              <el-select
                v-model="form.customerId"
                filterable
                remote
                reserve-keyword
                placeholder="输入名称进行查询"
                :remote-method="loadMyCustomerOption"
                :loading="loadingCustomer"
                style="width: 240px"
              >
                <el-option v-for="item in myCustomerOptions" :key="item.id" :label="item.name + '-' + item.id" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商机阶段" prop="state">
              <el-select v-model="form.state" placeholder="请选择商机阶段">
                <el-option v-for="dict in ditalk_opportunity_state" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-form-item label="指派给" prop="assignedTo">
          <el-input v-model="form.assignedTo" placeholder="请输入指派给" />
        </el-form-item> -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="预计销售金额" prop="amount">
              <el-input-number v-model="amount" placeholder="请输入预计销售金额" :min="0" :precision="2" style="width: 180px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预计成交日期" prop="closeDate">
              <el-date-picker clearable v-model="form.closeDate" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择预计成交日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注信息" prop="remark">
          <el-input type="textarea" v-model="form.remark" placeholder="请输入备注信息" />
        </el-form-item>
        <!-- <el-form-item label="关联订单ID" prop="orderId">
          <el-input v-model="form.orderId" placeholder="请输入订单ID" />
        </el-form-item> -->
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
import { listInfo, getInfo, delInfo, addInfo, updateInfo } from '@/api/opportunity/info';
import { InfoVO, InfoQuery, InfoForm } from '@/api/opportunity/info/types';
import { listMyCustomer, getMyCustomerById } from '@/api/customer/info';
// import { InfoVO as CustomerVO, InfoQuery as CustomerQuery } from '@/api/customer/info/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { ditalk_opportunity_state } = toRefs<any>(proxy?.useDict('ditalk_opportunity_state'));

const infoList = ref<InfoVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const dateRangeCreateTime = ref<[DateModelType, DateModelType]>(['', '']);
const dateRangeCloseDate = ref<[DateModelType, DateModelType]>(['', '']);

const queryFormRef = ref<ElFormInstance>();
const infoFormRef = ref<ElFormInstance>();

const amount = ref(0); // 预计销售金额，用于单位转换
const myCustomerOptions = ref<{ id: number | string; name: string }[]>([]);
const loadingCustomer = ref(false);

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: InfoForm = {
  id: undefined,
  version: undefined,
  title: undefined,
  customerId: undefined,
  amount: undefined,
  assignedTo: undefined,
  orderId: undefined,
  remark: undefined,
  closeDate: undefined,
  state: undefined
};
const data = reactive<PageData<InfoForm, InfoQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    id: undefined,
    title: undefined,
    customerId: undefined,
    assignedTo: undefined,
    orderId: undefined,
    state: undefined,
    params: {
      createTime: undefined,
      closeDate: undefined
    }
  },
  rules: {
    id: [{ required: true, message: 'ID不能为空', trigger: 'blur' }],
    title: [{ required: true, message: '商机标题不能为空', trigger: 'blur' }],
    customerId: [{ required: true, message: '客户ID不能为空', trigger: 'blur' }],
    state: [{ required: true, message: '商机阶段不能为空', trigger: 'change' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询商机信息列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.params = {};
  proxy?.addDateRange(queryParams.value, dateRangeCreateTime.value, 'CreateTime');
  proxy?.addDateRange(queryParams.value, dateRangeCloseDate.value, 'CloseDate');
  const res = await listInfo(queryParams.value);
  res.rows.forEach((item) => {
    item.amount = item.amount / 100; // 单位转换
  });
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
  myCustomerOptions.value = [];
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  dateRangeCreateTime.value = ['', ''];
  dateRangeCloseDate.value = ['', ''];
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
  dialog.title = '添加商机信息';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: InfoVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getInfo(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改商机信息';
  // 单位转换
  amount.value = form.value.amount / 100;
  // 加载客户
  loadDefaultCustomerOption(form.value.customerId);
};

/** 提交按钮 */
const submitForm = () => {
  infoFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      // 单位转换
      form.value.amount = amount.value * 100;
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
  await proxy?.$modal.confirm('是否确认删除商机信息编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delInfo(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'opportunity/info/export',
    {
      ...queryParams.value
    },
    `info_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});

const loadMyCustomerOption = async (query: string) => {
  loadingCustomer.value = true;
  const res = await listMyCustomer({
    name: query,
    pageNum: 1,
    pageSize: 40
  });
  myCustomerOptions.value = res.data.map((item) => ({
    id: item.id,
    name: item.name
  }));
  loadingCustomer.value = false;
};

const loadDefaultCustomerOption = async (id: string | number) => {
  // 加载客户
  const res = await getMyCustomerById(id);
  myCustomerOptions.value = [
    {
      id: res.data.id,
      name: res.data.name
    }
  ];
};
</script>
