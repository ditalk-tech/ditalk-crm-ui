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
            <el-form-item label="商机ID" prop="opportunityId">
              <el-input v-model="queryParams.opportunityId" placeholder="请输入商机ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="客户ID" prop="customerId">
              <el-input v-model="queryParams.customerId" placeholder="请输入客户ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="联系人ID" prop="contactId">
              <el-input v-model="queryParams.contactId" placeholder="请输入联系人ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="编号" prop="code">
              <el-input v-model="queryParams.code" placeholder="请输入编号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="有效期到" style="width: 308px">
              <el-date-picker
                v-model="dateRangeValidUntil"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
              />
            </el-form-item>
            <el-form-item label="分派给" prop="assignedTo">
              <el-input v-model="queryParams.assignedTo" placeholder="请输入分派给" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="分派部门" prop="assignedDept">
              <el-input v-model="queryParams.assignedDept" placeholder="请输入分派部门" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="审批状态" prop="approvalState">
              <el-select v-model="queryParams.approvalState" placeholder="请选择审批状态" clearable>
                <el-option v-for="dict in wf_business_status" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="交互状态" prop="quotationState">
              <el-select v-model="queryParams.quotationState" placeholder="请选择交互状态" clearable>
                <el-option v-for="dict in ditalk_opportunity_quotation_state" :key="dict.value" :label="dict.label" :value="dict.value" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['opportunity:quotation:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['opportunity:quotation:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['opportunity:quotation:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['opportunity:quotation:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="quotationList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" fixed="left" />
        <el-table-column label="ID" align="center" prop="id" v-if="true" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180" />
        <el-table-column label="商机ID" align="center" prop="opportunityId" />
        <el-table-column label="客户ID" align="center" prop="customerId" />
        <el-table-column label="联系人ID" align="center" prop="contactId" />
        <el-table-column label="编号" align="center" prop="code" />
        <el-table-column label="总售价" align="center" prop="totalSalePrice" />
        <el-table-column label="总定价" align="center" prop="totalOriginalPrice" />
        <el-table-column label="总成本" align="center" prop="totalCostPrice" />
        <el-table-column label="有效期到" align="center" prop="validUntil" width="180" />
        <el-table-column label="分派给" align="center" prop="assignedTo" />
        <el-table-column label="分派部门" align="center" prop="assignedDept" />
        <el-table-column label="审批状态" align="center" prop="approvalState">
          <template #default="scope">
            <dict-tag :options="wf_business_status" :value="scope.row.approvalState" />
          </template>
        </el-table-column>
        <el-table-column label="交互状态" align="center" prop="quotationState">
          <template #default="scope">
            <dict-tag :options="ditalk_opportunity_quotation_state" :value="scope.row.quotationState" />
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
          <template #default="scope">
            <el-button-group>
              <el-tooltip content="修改" placement="top">
                <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['opportunity:quotation:edit']"></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button
                  link
                  type="primary"
                  icon="Delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['opportunity:quotation:remove']"
                ></el-button>
              </el-tooltip>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改商机报价单对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="960px" append-to-body>
      <el-form ref="quotationFormRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="商机ID" prop="opportunityId">
          <el-input v-model="form.opportunityId" placeholder="请输入商机ID" />
        </el-form-item>
        <el-form-item label="客户ID" prop="customerId">
          <el-input v-model="form.customerId" placeholder="请输入客户ID" />
        </el-form-item>
        <el-form-item label="联系人ID" prop="contactId">
          <el-input v-model="form.contactId" placeholder="请输入联系人ID" />
        </el-form-item>
        <el-form-item label="编号" prop="code">
          <el-input v-model="form.code" placeholder="请输入编号" />
        </el-form-item>
        <el-form-item label="总售价" prop="totalSalePrice">
          <el-input v-model="form.totalSalePrice" placeholder="请输入总售价" />
        </el-form-item>
        <el-form-item label="总定价" prop="totalOriginalPrice">
          <el-input v-model="form.totalOriginalPrice" placeholder="请输入总定价" />
        </el-form-item>
        <el-form-item label="总成本" prop="totalCostPrice">
          <el-input v-model="form.totalCostPrice" placeholder="请输入总成本" />
        </el-form-item>
        <el-form-item label="有效期到" prop="validUntil">
          <el-date-picker clearable v-model="form.validUntil" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择有效期到">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="分派给" prop="assignedTo">
          <el-input v-model="form.assignedTo" placeholder="请输入分派给" />
        </el-form-item>
        <el-form-item label="分派部门" prop="assignedDept">
          <el-input v-model="form.assignedDept" placeholder="请输入分派部门" />
        </el-form-item>
        <el-form-item label="审批状态" prop="approvalState">
          <el-radio-group v-model="form.approvalState">
            <el-radio v-for="dict in wf_business_status" :key="dict.value" :value="dict.value">{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="交互状态" prop="quotationState">
          <el-radio-group v-model="form.quotationState">
            <el-radio v-for="dict in ditalk_opportunity_quotation_state" :key="dict.value" :value="dict.value">{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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

<script setup name="Quotation" lang="ts">
import { listQuotation, getQuotation, delQuotation, addQuotation, updateQuotation } from '@/api/opportunity/quotation';
import { QuotationVO, QuotationQuery, QuotationForm } from '@/api/opportunity/quotation/types';

const route = useRoute();
const router = useRouter();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { wf_business_status, ditalk_opportunity_quotation_state } = toRefs<any>(
  proxy?.useDict('wf_business_status', 'ditalk_opportunity_quotation_state')
);

const quotationList = ref<QuotationVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const dateRangeCreateTime = ref<[DateModelType, DateModelType]>(['', '']);
const dateRangeValidUntil = ref<[DateModelType, DateModelType]>(['', '']);

const queryFormRef = ref<ElFormInstance>();
const quotationFormRef = ref<ElFormInstance>();

const defaultOpportunityId = ref<string>();
const defaultCustomerId = ref<string>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: QuotationForm = {
  id: undefined,
  version: undefined,
  opportunityId: undefined,
  customerId: undefined,
  contactId: undefined,
  code: undefined,
  totalSalePrice: undefined,
  totalOriginalPrice: undefined,
  totalCostPrice: undefined,
  validUntil: undefined,
  assignedTo: undefined,
  assignedDept: undefined,
  approvalState: undefined,
  quotationState: undefined,
  remark: undefined
};
const data = reactive<PageData<QuotationForm, QuotationQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    id: undefined,
    opportunityId: undefined,
    customerId: undefined,
    contactId: undefined,
    code: undefined,
    assignedTo: undefined,
    assignedDept: undefined,
    approvalState: undefined,
    quotationState: undefined,
    params: {
      createTime: undefined,
      validUntil: undefined
    }
  },
  rules: {
    id: [{ required: true, message: 'ID不能为空', trigger: 'blur' }],
    opportunityId: [{ required: true, message: '商机ID不能为空', trigger: 'blur' }],
    customerId: [{ required: true, message: '客户ID不能为空', trigger: 'blur' }],
    contactId: [{ required: true, message: '联系人ID不能为空', trigger: 'blur' }],
    code: [{ required: true, message: '编号不能为空', trigger: 'blur' }],
    totalSalePrice: [{ required: true, message: '总售价不能为空', trigger: 'blur' }],
    totalOriginalPrice: [{ required: true, message: '总定价不能为空', trigger: 'blur' }],
    totalCostPrice: [{ required: true, message: '总成本不能为空', trigger: 'blur' }],
    validUntil: [{ required: true, message: '有效期到不能为空', trigger: 'blur' }],
    approvalState: [{ required: true, message: '审批状态不能为空', trigger: 'change' }],
    quotationState: [{ required: true, message: '交互状态不能为空', trigger: 'change' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询商机报价单列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.params = {};
  proxy?.addDateRange(queryParams.value, dateRangeCreateTime.value, 'CreateTime');
  proxy?.addDateRange(queryParams.value, dateRangeValidUntil.value, 'ValidUntil');
  const res = await listQuotation(queryParams.value);
  quotationList.value = res.rows;
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
  quotationFormRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  dateRangeCreateTime.value = ['', ''];
  dateRangeValidUntil.value = ['', ''];
  queryFormRef.value?.resetFields();
  handleQuery();
  queryParams.value.customerId = defaultCustomerId.value;
  queryParams.value.opportunityId = defaultOpportunityId.value;
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: QuotationVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加商机报价单';
  form.value.customerId = queryParams.value.customerId;
  form.value.opportunityId = queryParams.value.opportunityId;
};

/** 修改按钮操作 */
const handleUpdate = async (row?: QuotationVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getQuotation(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改商机报价单';
};

/** 提交按钮 */
const submitForm = () => {
  quotationFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateQuotation(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addQuotation(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: QuotationVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除商机报价单编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delQuotation(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'opportunity/quotation/export',
    {
      ...queryParams.value
    },
    `quotation_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  setDefualtParams();
  getList();
});

/** 处理路由参数，初始化客户选项列表 */
const setDefualtParams = async () => {
  defaultCustomerId.value = route.params && (route.params.customerId as string);
  queryParams.value.customerId = defaultCustomerId.value;
  defaultOpportunityId.value = route.params && (route.params.opportunityId as string);
  queryParams.value.opportunityId = defaultOpportunityId.value;
};
</script>
