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
            <el-form-item label="客户ID" prop="customerId">
              <el-input v-model="queryParams.customerId" placeholder="请输入客户ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="原用户ID" prop="oldUserId">
              <el-input v-model="queryParams.oldUserId" placeholder="请输入原用户ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="原部门ID" prop="oldDeptId">
              <el-input v-model="queryParams.oldDeptId" placeholder="请输入原部门ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="新用户ID" prop="newUserId">
              <el-input v-model="queryParams.newUserId" placeholder="请输入新用户ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="新部门ID" prop="newDeptId">
              <el-input v-model="queryParams.newDeptId" placeholder="请输入新部门ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="状态" prop="state">
              <el-select v-model="queryParams.state" placeholder="请选择状态" clearable>
                <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['customer:transferLog:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['customer:transferLog:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['customer:transferLog:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['customer:transferLog:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="transferLogList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" fixed="left" />
        <el-table-column label="ID" align="center" prop="id" v-if="true" />
        <el-table-column label="创建时间" align="center" prop="createTime" />
        <el-table-column label="客户ID" align="center" prop="customerId" />
        <el-table-column label="原用户ID" align="center" prop="oldUserId" />
        <el-table-column label="原部门ID" align="center" prop="oldDeptId" />
        <el-table-column label="新用户ID" align="center" prop="newUserId" />
        <el-table-column label="新部门ID" align="center" prop="newDeptId" />
        <el-table-column label="状态" align="center" prop="state">
          <template #default="scope">
            <dict-tag :options="sys_normal_disable" :value="scope.row.state" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['customer:transferLog:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['customer:transferLog:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改客户转移记录对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="960px" append-to-body>
      <el-form ref="transferLogFormRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="客户ID" prop="customerId">
          <el-input v-model="form.customerId" placeholder="请输入客户ID" />
        </el-form-item>
        <el-form-item label="原用户ID" prop="oldUserId">
          <el-input v-model="form.oldUserId" placeholder="请输入原用户ID" />
        </el-form-item>
        <el-form-item label="原部门ID" prop="oldDeptId">
          <el-input v-model="form.oldDeptId" placeholder="请输入原部门ID" />
        </el-form-item>
        <el-form-item label="新用户ID" prop="newUserId">
          <el-input v-model="form.newUserId" placeholder="请输入新用户ID" />
        </el-form-item>
        <el-form-item label="新部门ID" prop="newDeptId">
          <el-input v-model="form.newDeptId" placeholder="请输入新部门ID" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-radio-group v-model="form.state">
            <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :value="dict.value">{{ dict.label }}</el-radio>
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

<script setup name="TransferLog" lang="ts">
import { listTransferLog, getTransferLog, delTransferLog, addTransferLog, updateTransferLog } from '@/api/customer/transferLog';
import { TransferLogVO, TransferLogQuery, TransferLogForm } from '@/api/customer/transferLog/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { sys_normal_disable } = toRefs<any>(proxy?.useDict('sys_normal_disable'));

const transferLogList = ref<TransferLogVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const dateRangeCreateTime = ref<[DateModelType, DateModelType]>(['', '']);

const queryFormRef = ref<ElFormInstance>();
const transferLogFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: TransferLogForm = {
  id: undefined,
  version: undefined,
  customerId: undefined,
  oldUserId: undefined,
  oldDeptId: undefined,
  newUserId: undefined,
  newDeptId: undefined,
  state: undefined
};
const data = reactive<PageData<TransferLogForm, TransferLogQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    id: undefined,
    customerId: undefined,
    oldUserId: undefined,
    oldDeptId: undefined,
    newUserId: undefined,
    newDeptId: undefined,
    state: undefined,
    params: {
      createTime: undefined
    }
  },
  rules: {
    id: [{ required: true, message: 'ID不能为空', trigger: 'blur' }],
    customerId: [{ required: true, message: '客户ID不能为空', trigger: 'blur' }],
    state: [{ required: true, message: '状态不能为空', trigger: 'change' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询客户转移记录列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.params = {};
  proxy?.addDateRange(queryParams.value, dateRangeCreateTime.value, 'CreateTime');
  const res = await listTransferLog(queryParams.value);
  transferLogList.value = res.rows;
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
  transferLogFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: TransferLogVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加客户转移记录';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: TransferLogVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getTransferLog(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改客户转移记录';
};

/** 提交按钮 */
const submitForm = () => {
  transferLogFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateTransferLog(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addTransferLog(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: TransferLogVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除客户转移记录编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delTransferLog(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'customer/transferLog/export',
    {
      ...queryParams.value
    },
    `transferLog_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
