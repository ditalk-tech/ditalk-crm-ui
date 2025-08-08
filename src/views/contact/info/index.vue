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
            <el-form-item :label="typeName + 'ID'" prop="customerId">
              <el-input v-model="queryParams.customerId" :placeholder="'请输入' + typeName + 'ID'" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="姓氏" prop="lastName">
              <el-input v-model="queryParams.lastName" placeholder="请输入姓氏" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="名称" prop="firstName">
              <el-input v-model="queryParams.firstName" placeholder="请输入名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="姓名拼音" prop="pinyin">
              <el-input v-model="queryParams.pinyin" placeholder="请输入姓名拼音" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-select v-model="queryParams.gender" placeholder="请选择性别" clearable>
                <el-option v-for="dict in sys_user_sex" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="queryParams.email" placeholder="请输入电子邮箱" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="queryParams.phone" placeholder="请输入联系电话" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <template v-if="showMoreConditions">
              <el-form-item label="职位" prop="position">
                <el-input v-model="queryParams.position" placeholder="请输入职位" clearable @keyup.enter="handleQuery" />
              </el-form-item>
              <el-form-item label="生日" style="width: 308px">
                <el-date-picker
                  v-model="dateRangeBirthday"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
                />
              </el-form-item>
              <el-form-item label="户籍" prop="placeOfOrigin">
                <el-input v-model="queryParams.placeOfOrigin" placeholder="请输入户籍" clearable @keyup.enter="handleQuery" />
              </el-form-item>
              <el-form-item label="居住地" prop="address">
                <el-input v-model="queryParams.address" placeholder="请输入居住地" clearable @keyup.enter="handleQuery" />
              </el-form-item>
              <el-form-item label="毕业学校" prop="graduationSchool">
                <el-input v-model="queryParams.graduationSchool" placeholder="请输入毕业学校" clearable @keyup.enter="handleQuery" />
              </el-form-item>
              <el-form-item label="学历" prop="qualification">
                <el-select v-model="queryParams.qualification" placeholder="请选择学历" clearable>
                  <el-option v-for="dict in ditalk_educational_qualification" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="社会角色" prop="socialRole">
                <el-input v-model="queryParams.socialRole" placeholder="请输入社会角色" clearable @keyup.enter="handleQuery" />
              </el-form-item>
              <el-form-item label="最近接触时间" style="width: 308px">
                <el-date-picker
                  v-model="dateRangeLastContactTime"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
                />
              </el-form-item>
              <el-form-item label="接触频率" prop="contactFrequency">
                <el-select v-model="queryParams.contactFrequency" placeholder="请选择接触频率" clearable>
                  <el-option v-for="dict in ditalk_contact_frequency" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="微信" prop="wechat">
                <el-input v-model="queryParams.wechat" placeholder="请输入微信" clearable @keyup.enter="handleQuery" />
              </el-form-item>
              <el-form-item label="QQ" prop="qq">
                <el-input v-model="queryParams.qq" placeholder="请输入QQ" clearable @keyup.enter="handleQuery" />
              </el-form-item>
              <el-form-item label="钉钉" prop="dingTalk">
                <el-input v-model="queryParams.dingTalk" placeholder="请输入钉钉" clearable @keyup.enter="handleQuery" />
              </el-form-item>
              <el-form-item label="飞书" prop="lark">
                <el-input v-model="queryParams.lark" placeholder="请输入飞书" clearable @keyup.enter="handleQuery" />
              </el-form-item>
              <el-form-item label="WhatsApp" prop="whatsApp">
                <el-input v-model="queryParams.whatsApp" placeholder="请输入WhatsApp" clearable @keyup.enter="handleQuery" />
              </el-form-item>
              <el-form-item label="Facebook" prop="facebook">
                <el-input v-model="queryParams.facebook" placeholder="请输入Facebook" clearable @keyup.enter="handleQuery" />
              </el-form-item>
            </template>
            <el-form-item label="状态" prop="state">
              <el-select v-model="queryParams.state" placeholder="请选择状态" clearable>
                <el-option v-for="dict in ditalk_contact_state" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
              <el-button icon="more" @click="showMoreConditions = !showMoreConditions">更多搜索条件</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['contact:info:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['contact:info:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['contact:info:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['contact:info:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="infoList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" fixed="left" />
        <el-table-column label="ID" align="center" prop="id" v-if="true" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180" />
        <el-table-column :label="typeName + 'ID'" align="center" prop="customerId" />
        <el-table-column label="姓氏" align="center" prop="lastName" />
        <el-table-column label="名称" align="center" prop="firstName" />
        <el-table-column label="头像" align="center" prop="avatarUrl" width="100">
          <template #default="scope">
            <image-preview :src="scope.row.avatarUrl" :width="50" :height="50" />
          </template>
        </el-table-column>
        <el-table-column label="姓名拼音" align="center" prop="pinyin" />
        <el-table-column label="性别" align="center" prop="gender">
          <template #default="scope">
            <dict-tag :options="sys_user_sex" :value="scope.row.gender ?? ''" />
          </template>
        </el-table-column>
        <el-table-column label="电子邮箱" align="center" prop="email" />
        <el-table-column label="联系电话" align="center" prop="phone" />
        <el-table-column label="职位" align="center" prop="position" />
        <el-table-column label="备注信息" align="center" prop="remark" />
        <el-table-column label="生日" align="center" prop="birthday" width="180" />
        <el-table-column label="户籍" align="center" prop="placeOfOrigin" />
        <el-table-column label="居住地" align="center" prop="address" />
        <el-table-column label="毕业学校" align="center" prop="graduationSchool" />
        <el-table-column label="学历" align="center" prop="qualification">
          <template #default="scope">
            <dict-tag :options="ditalk_educational_qualification" :value="scope.row.qualification ?? ''" />
          </template>
        </el-table-column>
        <el-table-column label="社会角色" align="center" prop="socialRole" />
        <el-table-column label="最近接触时间" align="center" prop="lastContactTime" width="180" />
        <el-table-column label="接触频率" align="center" prop="contactFrequency">
          <template #default="scope">
            <dict-tag :options="ditalk_contact_frequency" :value="scope.row.contactFrequency ?? ''" />
          </template>
        </el-table-column>
        <el-table-column label="微信" align="center" prop="wechat" />
        <el-table-column label="QQ" align="center" prop="qq" />
        <el-table-column label="钉钉" align="center" prop="dingTalk" />
        <el-table-column label="飞书" align="center" prop="lark" />
        <el-table-column label="WhatsApp" align="center" prop="whatsApp" />
        <el-table-column label="Facebook" align="center" prop="facebook" />
        <el-table-column label="状态" align="center" prop="state">
          <template #default="scope">
            <dict-tag :options="ditalk_contact_state" :value="scope.row.state" />
          </template>
        </el-table-column>
        <el-table-column label="分配到" align="center" prop="assignedTo" />
        <el-table-column label="分配部门" align="center" prop="assignedDept" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['contact:info:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['contact:info:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改联系人信息对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="960px" append-to-body>
      <el-form ref="infoFormRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item :label="typeName + 'ID'" prop="customerId">
          <el-input v-model="form.customerId" :placeholder="'请输入' + typeName + 'ID'" />
        </el-form-item>
        <el-form-item label="姓氏" prop="lastName">
          <el-input v-model="form.lastName" placeholder="请输入姓氏" />
        </el-form-item>
        <el-form-item label="名称" prop="firstName">
          <el-input v-model="form.firstName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <image-upload v-model="form.avatar" :limit="1" />
        </el-form-item>
        <el-form-item label="姓名拼音" prop="pinyin">
          <el-input v-model="form.pinyin" placeholder="请输入姓名拼音" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio v-for="dict in sys_user_sex" :key="dict.value" :value="dict.value">{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入电子邮箱" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input v-model="form.position" placeholder="请输入职位" />
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="分配到" prop="assignedTo">
          <el-input v-model="form.assignedTo" placeholder="请输入分配到" />
        </el-form-item>
        <el-form-item label="分配部门" prop="assignedDept">
          <el-input v-model="form.assignedDept" placeholder="请输入分配部门" />
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker clearable v-model="form.birthday" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择生日">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="户籍" prop="placeOfOrigin">
          <el-input v-model="form.placeOfOrigin" placeholder="请输入户籍" />
        </el-form-item>
        <el-form-item label="居住地" prop="address">
          <el-input v-model="form.address" placeholder="请输入居住地" />
        </el-form-item>
        <el-form-item label="毕业学校" prop="graduationSchool">
          <el-input v-model="form.graduationSchool" placeholder="请输入毕业学校" />
        </el-form-item>
        <el-form-item label="学历" prop="qualification">
          <el-select v-model="form.qualification" placeholder="请选择学历">
            <el-option v-for="dict in ditalk_educational_qualification" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="社会角色" prop="socialRole">
          <el-input v-model="form.socialRole" placeholder="请输入社会角色" />
        </el-form-item>
        <el-form-item label="最近接触时间" prop="lastContactTime">
          <el-date-picker
            clearable
            v-model="form.lastContactTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择最近接触时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="接触频率" prop="contactFrequency" clearable>
          <el-select v-model="form.contactFrequency" placeholder="请选择接触频率">
            <el-option v-for="dict in ditalk_contact_frequency" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="微信" prop="wechat">
          <el-input v-model="form.wechat" placeholder="请输入微信" />
        </el-form-item>
        <el-form-item label="QQ" prop="qq">
          <el-input v-model="form.qq" placeholder="请输入QQ" />
        </el-form-item>
        <el-form-item label="钉钉" prop="dingTalk">
          <el-input v-model="form.dingTalk" placeholder="请输入钉钉" />
        </el-form-item>
        <el-form-item label="飞书" prop="lark">
          <el-input v-model="form.lark" placeholder="请输入飞书" />
        </el-form-item>
        <el-form-item label="WhatsApp" prop="whatsApp">
          <el-input v-model="form.whatsApp" placeholder="请输入WhatsApp" />
        </el-form-item>
        <el-form-item label="Facebook" prop="facebook">
          <el-input v-model="form.facebook" placeholder="请输入Facebook" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-radio-group v-model="form.state">
            <el-radio v-for="dict in ditalk_contact_state" :key="dict.value" :value="dict.value">{{ dict.label }}</el-radio>
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
import { listInfo, getInfo, delInfo, addInfo, updateInfo } from '@/api/contact/info';
import { InfoVO, InfoQuery, InfoForm } from '@/api/contact/info/types';

const route = useRoute();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { ditalk_educational_qualification, ditalk_contact_frequency, ditalk_contact_state, sys_user_sex } = toRefs<any>(
  proxy?.useDict('ditalk_educational_qualification', 'ditalk_contact_frequency', 'ditalk_contact_state', 'sys_user_sex')
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
const dateRangeBirthday = ref<[DateModelType, DateModelType]>(['', '']);
const dateRangeLastContactTime = ref<[DateModelType, DateModelType]>(['', '']);

const queryFormRef = ref<ElFormInstance>();
const infoFormRef = ref<ElFormInstance>();

const showMoreConditions = ref<boolean>(false);
const defaultType = ref<string>('');
const defaultCustomerId = ref<string>('');

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: InfoForm = {
  id: undefined,
  version: undefined,
  customerId: undefined,
  lastName: undefined,
  firstName: undefined,
  pinyin: undefined,
  gender: undefined,
  email: undefined,
  phone: undefined,
  position: undefined,
  remark: undefined,
  birthday: undefined,
  placeOfOrigin: undefined,
  address: undefined,
  graduationSchool: undefined,
  qualification: undefined,
  socialRole: undefined,
  lastContactTime: undefined,
  contactFrequency: undefined,
  wechat: undefined,
  qq: undefined,
  dingTalk: undefined,
  lark: undefined,
  whatsApp: undefined,
  facebook: undefined,
  state: undefined,
  assignedTo: undefined,
  assignedDept: undefined
};
const data = reactive<PageData<InfoForm, InfoQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    id: undefined,
    customerId: undefined,
    lastName: undefined,
    firstName: undefined,
    pinyin: undefined,
    gender: undefined,
    email: undefined,
    phone: undefined,
    position: undefined,
    placeOfOrigin: undefined,
    address: undefined,
    graduationSchool: undefined,
    qualification: undefined,
    socialRole: undefined,
    contactFrequency: undefined,
    wechat: undefined,
    qq: undefined,
    dingTalk: undefined,
    lark: undefined,
    whatsApp: undefined,
    facebook: undefined,
    state: undefined,
    assignedTo: undefined,
    assignedDept: undefined,
    params: {
      createTime: undefined,
      birthday: undefined,
      lastContactTime: undefined
    }
  },
  rules: {
    id: [{ required: true, message: 'ID不能为空', trigger: 'blur' }],
    customerId: [{ required: true, message: '客户ID不能为空', trigger: 'blur' }],
    firstName: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
    state: [{ required: true, message: '状态不能为空', trigger: 'change' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询联系人信息列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.params = {};
  proxy?.addDateRange(queryParams.value, dateRangeCreateTime.value, 'CreateTime');
  proxy?.addDateRange(queryParams.value, dateRangeBirthday.value, 'Birthday');
  proxy?.addDateRange(queryParams.value, dateRangeLastContactTime.value, 'LastContactTime');
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
  dateRangeBirthday.value = ['', ''];
  dateRangeLastContactTime.value = ['', ''];
  queryFormRef.value?.resetFields();
  queryParams.value.customerId = defaultCustomerId.value;
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
  dialog.title = '添加联系人信息';
  form.value.customerId = queryParams.value.customerId;
};

/** 修改按钮操作 */
const handleUpdate = async (row?: InfoVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getInfo(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改联系人信息';
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
  await proxy?.$modal.confirm('是否确认删除联系人信息编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delInfo(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'contact/info/export',
    {
      ...queryParams.value
    },
    `info_${new Date().getTime()}.xlsx`
  );
};

const typeName = computed(() => {
  return defaultType.value === 'lead' ? '线索' : '客户';
});

onMounted(() => {
  setDefualtCustomerId();
  getList();
});

/** 设置默认客户ID */
const setDefualtCustomerId = async () => {
  defaultType.value = route.params && (route.params.type as string);
  queryParams.value.customerId = route.params && (route.params.customerId as string);
  defaultCustomerId.value = route.params && (route.params.customerId as string);
};
</script>
