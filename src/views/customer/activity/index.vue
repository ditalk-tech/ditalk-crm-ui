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
            <el-form-item label="联系人ID" prop="contactId">
              <el-input v-model="queryParams.contactId" placeholder="请输入联系人ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="商机ID" prop="opportunityId">
              <el-input v-model="queryParams.opportunityId" placeholder="请输入商机ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="活动类型" prop="type">
              <el-select v-model="queryParams.type" placeholder="请选择活动类型" clearable>
                <el-option v-for="dict in ditalk_customer_activity_type" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="主题" prop="subject">
              <el-input v-model="queryParams.subject" placeholder="请输入主题" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="描述内容" prop="description">
              <el-input v-model="queryParams.description" placeholder="请输入描述内容" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="活动时间" style="width: 308px">
              <el-date-picker
                v-model="dateRangeActivityTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
              />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['customer:activity:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['customer:activity:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['customer:activity:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['customer:activity:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="activityList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" fixed="left" />
        <el-table-column label="ID" align="center" prop="id" v-if="true" />
        <el-table-column label="客户ID" align="center" prop="customerId" />
        <el-table-column label="联系人ID" align="center" prop="contactId" />
        <el-table-column label="商机ID" align="center" prop="opportunityId" />
        <el-table-column label="活动类型" align="center" prop="type">
          <template #default="scope">
            <dict-tag :options="ditalk_customer_activity_type" :value="scope.row.type" />
          </template>
        </el-table-column>
        <el-table-column label="主题" align="center" prop="subject" width="160">
          <template #default="scope">
            <el-tooltip :content="scope.row.subject" placement="top">
              <p class="descStyle">{{ scope.row.subject }}</p>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="描述内容" align="center" prop="description" width="240">
          <template #default="scope">
            <el-tooltip :content="scope.row.description" placement="top">
              <p class="descStyle">{{ scope.row.description }}</p>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="活动时间" align="center" prop="activityTime" />
        <el-table-column label="创建人ID" align="center" prop="createBy" />
        <el-table-column label="创建时间" align="center" prop="createTime" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['customer:activity:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['customer:activity:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改客户活动记录对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="960px" append-to-body>
      <el-form ref="activityFormRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="客户" prop="customerId">
          <el-select v-model="form.customerId" placeholder="请选择客户" filterable @change="getContactInfoOptionList">
            <el-option v-for="dict in customerInfoOptionList" :key="dict.id" :label="dict.name + ' --- ' + dict.id" :value="dict.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系人" prop="contactId">
          <el-select v-model="form.contactId" placeholder="请选择联系人">
            <el-option
              v-for="dict in contactInfoOptionList"
              :key="dict.id"
              :label="dict.lastName + ' ' + dict.firstName + ' --- ' + dict.id"
              :value="dict.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商机ID" prop="opportunityId">
          <el-input v-model="form.opportunityId" placeholder="请输入商机ID" />
        </el-form-item>
        <el-form-item label="活动类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择活动类型">
            <el-option v-for="dict in ditalk_customer_activity_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主题" prop="subject">
          <el-input v-model="form.subject" placeholder="请输入主题" />
        </el-form-item>
        <el-form-item label="描述内容" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="活动时间" prop="activityTime">
          <el-date-picker clearable v-model="form.activityTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择活动时间">
          </el-date-picker>
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

<script setup name="Activity" lang="ts">
import { listActivity, getActivity, delActivity, addActivity, updateActivity } from '@/api/customer/activity';
import { ActivityVO, ActivityQuery, ActivityForm } from '@/api/customer/activity/types';
import { InfoOptionVO as ContactInfoOptionVO } from '@/api/contact/info/types';
import { listInfoOption as listContactOptionInfo } from '@/api/contact/info';
import { InfoOptionVO as CustomerInfoOptionVO } from '@/api/customer/info/types';
import { listAllInfoOption as listAllCustomerInfoOption } from '@/api/customer/info';

const route = useRoute();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { ditalk_customer_activity_type } = toRefs<any>(proxy?.useDict('ditalk_customer_activity_type'));

const activityList = ref<ActivityVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const dateRangeCreateTime = ref<[DateModelType, DateModelType]>(['', '']);
const dateRangeActivityTime = ref<[DateModelType, DateModelType]>(['', '']);

const queryFormRef = ref<ElFormInstance>();
const activityFormRef = ref<ElFormInstance>();
const defaultCustomerId = ref<string>('');
// const defaultContactId = ref<string>('');

const customerInfoOptionList = ref<CustomerInfoOptionVO[]>([]); // 客户详情选项列表
const contactInfoOptionList = ref<ContactInfoOptionVO[]>([]); // 联系人详情选项列表

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: ActivityForm = {
  id: undefined,
  version: undefined,
  customerId: undefined,
  contactId: undefined,
  opportunityId: undefined,
  type: undefined,
  subject: undefined,
  description: undefined,
  activityTime: undefined
};
const data = reactive<PageData<ActivityForm, ActivityQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    id: undefined,
    customerId: undefined,
    contactId: undefined,
    opportunityId: undefined,
    type: undefined,
    subject: undefined,
    description: undefined,
    params: {
      createTime: undefined,
      activityTime: undefined
    }
  },
  rules: {
    id: [{ required: true, message: 'ID不能为空', trigger: 'blur' }],
    customerId: [{ required: true, message: '客户ID不能为空', trigger: 'blur' }],
    contactId: [{ required: true, message: '联系人ID不能为空', trigger: 'blur' }],
    type: [{ required: true, message: '活动类型不能为空', trigger: 'change' }],
    subject: [{ required: true, message: '主题不能为空', trigger: 'blur' }],
    description: [{ required: true, message: '描述内容不能为空', trigger: 'blur' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询客户活动记录列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.params = {};
  proxy?.addDateRange(queryParams.value, dateRangeCreateTime.value, 'CreateTime');
  proxy?.addDateRange(queryParams.value, dateRangeActivityTime.value, 'ActivityTime');
  const res = await listActivity(queryParams.value);
  activityList.value = res.rows;
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
  activityFormRef.value?.resetFields();
  // customerInfoOptionList.value = []; // 目前加载页面时只请求一次后台
  contactInfoOptionList.value = [];
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  dateRangeCreateTime.value = ['', ''];
  dateRangeActivityTime.value = ['', ''];
  queryFormRef.value?.resetFields();
  queryParams.value.customerId = defaultCustomerId.value;
  // queryParams.value.contactId = defaultContactId.value;
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: ActivityVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加客户活动记录';
  form.value.customerId = queryParams.value.customerId;
  // form.value.contactId = queryParams.value.contactId;
  if (form.value.customerId) {
    getContactInfoOptionList(form.value.customerId);
  }
};

/** 修改按钮操作 */
const handleUpdate = async (row?: ActivityVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getActivity(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改客户活动记录';
  if (form.value.customerId) {
    getContactInfoOptionList(form.value.customerId);
  }
};

/** 提交按钮 */
const submitForm = () => {
  activityFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateActivity(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addActivity(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: ActivityVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除客户活动记录编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delActivity(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'customer/activity/export',
    {
      ...queryParams.value
    },
    `activity_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  setDefualtCustomerId();
  getCustomerInfoList();
  getList();
});

/** 查询字典类型详细 */
const setDefualtCustomerId = async () => {
  queryParams.value.customerId = route.params && (route.params.customerId as string);
  defaultCustomerId.value = route.params && (route.params.customerId as string);
  // queryParams.value.contactId = route.params && (route.params.contactId as string);
  // defaultContactId.value = route.params && (route.params.contactId as string);
};

/** 获取联系人选项列表 */
const getContactInfoOptionList = async (customerId: number | string) => {
  const res = await listContactOptionInfo(customerId);
  contactInfoOptionList.value = res.data;
};

/** 获取全量客户选项列表 */
const getCustomerInfoList = async () => {
  const res = await listAllCustomerInfoOption();
  customerInfoOptionList.value = res.data;
};
</script>
<style scoped lang="scss">
.descStyle {
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
