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
              <el-select v-model="queryParams.assignedTo" placeholder="请选择用户" filterable clearable>
                <el-option
                  v-for="item in userOptionList"
                  :key="item.userId"
                  :label="item.userName + ' - ' + item.nickName"
                  :value="item.userId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分配部门" prop="assignedDept">
              <el-input v-model="queryParams.assignedDept" placeholder="请输入分配部门" clearable />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['lead:my:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['lead:my:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Refresh" :disabled="multiple" @click="reclaimLead()" v-hasPermi="['lead:my:reclaim']"
              >批量回收</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Switch" :disabled="multiple" @click="handleBatchTransferLead" v-hasPermi="['lead:my:transfer']"
              >批量转移</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Refresh" @click="handleReclaimUserLead" v-hasPermi="['lead:my:reclaim']">回收用户线索</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Switch" @click="handleTransferUserLead" v-hasPermi="['lead:my:transfer']">转移用户线索</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="infoList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" fixed="left" />
        <el-table-column label="ID" align="center" prop="id" v-if="true" />
        <el-table-column label="创建时间" align="center" prop="createTime" />
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
        <el-table-column label="线索状态" align="center" prop="leadState">
          <template #default="scope">
            <dict-tag :options="ditalk_lead_state" :value="scope.row.leadState" />
          </template>
        </el-table-column>
        <el-table-column label="分配到" align="center" prop="assignedTo" />
        <el-table-column label="分配部门" align="center" prop="assignedDept" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" :width="140" fixed="right">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleActivityInfoList(scope.row)" v-hasPermi="['customer:activity:list']"
              >活动</el-button
            >
            <el-button link type="success" size="small" @click="handleContactInfoList(scope.row)" v-hasPermi="['contact:info:list']"
              >联系人</el-button
            >
            <el-button link type="warning" size="small" @click="handleOpportunityInfoList(scope.row)" v-hasPermi="['opportunity:info:list']"
              >商机</el-button
            >
            <el-button link size="small">
              <el-dropdown trigger="click">
                <span>更多</span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <el-button link type="success" size="small" @click="handleUpdate(scope.row)" v-hasPermi="['lead:my:edit']">编辑</el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button link type="danger" size="small" @click="reclaimLead(scope.row.id)" v-hasPermi="['lead:my:reclaim']">回收</el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button link type="warning" size="small" @click="handleTransferLead(scope.row.id)" v-hasPermi="['lead:my:transfer']"
                        >转移</el-button
                      >
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>

    <!-- 添加或修改线索信息对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="960px" append-to-body>
      <el-row>
        <el-col :span="12" align="center">
          <el-text tag="b" size="large">客户</el-text>
        </el-col>
        <el-col :span="12" align="center">
          <el-text tag="b" size="large">联系人</el-text>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px">
        <el-col :span="12">
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
            <el-form-item label="备注信息" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
            <el-form-item label="线索状态" prop="leadState">
              <el-radio-group v-model="form.leadState">
                <el-radio v-for="dict in ditalk_lead_state" :key="dict.value" :value="dict.value">{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-form ref="contactFormRef" :model="contactForm" :rules="contactRules" label-width="120px">
            <el-form-item label="姓氏" prop="lastName">
              <el-input v-model="contactForm.lastName" placeholder="请输入姓氏" />
            </el-form-item>
            <el-form-item label="名称" prop="firstName">
              <el-input v-model="contactForm.firstName" placeholder="请输入名称" />
            </el-form-item>
            <el-form-item label="头像" prop="avatar">
              <image-upload v-model="contactForm.avatar" :limit="1" />
            </el-form-item>
            <el-form-item label="姓名拼音" prop="pinyin">
              <el-input v-model="contactForm.pinyin" placeholder="请输入姓名拼音" />
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="contactForm.gender">
                <el-radio v-for="dict in sys_user_sex" :key="dict.value" :value="dict.value">{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="状态" prop="state">
              <el-radio-group v-model="contactForm.state">
                <el-radio v-for="dict in ditalk_contact_state" :key="dict.value" :value="dict.value">{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="contactForm.email" placeholder="请输入电子邮箱" />
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="contactForm.phone" placeholder="请输入联系电话" />
            </el-form-item>
            <el-form-item label="职位" prop="position">
              <el-input v-model="contactForm.position" placeholder="请输入职位" />
            </el-form-item>
            <el-form-item label="备注信息" prop="remark">
              <el-input v-model="contactForm.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
            <el-collapse expand-icon-position="left">
              <el-collapse-item title="填写更多">
                <el-form-item label="微信" prop="wechat">
                  <el-input v-model="contactForm.wechat" placeholder="请输入微信" />
                </el-form-item>
                <el-form-item label="QQ" prop="qq">
                  <el-input v-model="contactForm.qq" placeholder="请输入QQ" />
                </el-form-item>
                <el-form-item label="钉钉" prop="dingTalk">
                  <el-input v-model="contactForm.dingTalk" placeholder="请输入钉钉" />
                </el-form-item>
                <el-form-item label="飞书" prop="lark">
                  <el-input v-model="contactForm.lark" placeholder="请输入飞书" />
                </el-form-item>
                <el-form-item label="WhatsApp" prop="whatsApp">
                  <el-input v-model="contactForm.whatsApp" placeholder="请输入WhatsApp" />
                </el-form-item>
                <el-form-item label="Facebook" prop="facebook">
                  <el-input v-model="contactForm.facebook" placeholder="请输入Facebook" />
                </el-form-item>
                <el-form-item label="生日" prop="birthday">
                  <el-date-picker
                    clearable
                    v-model="contactForm.birthday"
                    type="datetime"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    placeholder="请选择生日"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="户籍" prop="placeOfOrigin">
                  <el-input v-model="contactForm.placeOfOrigin" placeholder="请输入户籍" />
                </el-form-item>
                <el-form-item label="居住地" prop="address">
                  <el-input v-model="contactForm.address" placeholder="请输入居住地" />
                </el-form-item>
                <el-form-item label="毕业学校" prop="graduationSchool">
                  <el-input v-model="contactForm.graduationSchool" placeholder="请输入毕业学校" />
                </el-form-item>
                <el-form-item label="学历" prop="qualification">
                  <el-select v-model="contactForm.qualification" placeholder="请选择学历" clearable>
                    <el-option v-for="dict in ditalk_educational_qualification" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="社会角色" prop="socialRole">
                  <el-input v-model="contactForm.socialRole" placeholder="请输入社会角色" />
                </el-form-item>
                <el-form-item label="最近接触时间" prop="lastContactTime">
                  <el-date-picker
                    clearable
                    v-model="contactForm.lastContactTime"
                    type="datetime"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    placeholder="请选择最近接触时间"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="接触频率" prop="contactFrequency">
                  <el-select v-model="contactForm.contactFrequency" placeholder="请选择接触频率" clearable>
                    <el-option v-for="dict in ditalk_contact_frequency" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-collapse-item>
            </el-collapse>
          </el-form>
        </el-col>
      </el-row>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 回收线索对话框 -->
    <el-dialog :title="transferDialog.title" v-model="transferDialog.visible" width="960px" append-to-body>
      <el-form :model="transferForm" :rules="transferRules" ref="transferFormRef" label-width="120px">
        <!-- 选定的线索 -->
        <el-form-item label="线索ID" prop="leadIds">
          <el-input type="textarea" v-model="transferForm.leadIds" disabled />
        </el-form-item>
        <!-- 指定用户 -->
        <el-form-item label="指定用户" prop="userId">
          <el-select v-model="transferForm.userId" placeholder="请选择用户" clearable>
            <el-option
              v-for="dict in userOptionList"
              :key="dict.userId"
              :label="dict.nickName + ' --- ' + dict.userId"
              :value="dict.userId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelTransfer">取 消</el-button>
          <el-button :loading="buttonLoading" type="primary" @click="submitTransfer">确 定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 回收指定用户所有线索的对话框 -->
    <el-dialog :title="reclaimUserLeadDialog.title" v-model="reclaimUserLeadDialog.visible" width="600px" append-to-body>
      <el-form :model="reclaimUserLeadForm" :rules="reclaimUserLeadFormRules" ref="reclaimUserLeadFormRef" label-width="120px">
        <!-- 指定用户 -->
        <el-form-item label="指定用户" prop="userId">
          <el-select v-model="reclaimUserLeadForm.userId" placeholder="请选择用户" clearable>
            <el-option
              v-for="dict in userOptionList"
              :key="dict.userId"
              :label="dict.nickName + ' --- ' + dict.userId"
              :value="dict.userId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelReclaimUserLead">取 消</el-button>
          <el-button :loading="buttonLoading" type="primary" @click="submitReclaimUserLead">确 定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 转移指定用户所有线索到另一用户对话框 -->
    <el-dialog :title="transferUserLeadDialog.title" v-model="transferUserLeadDialog.visible" width="600px" append-to-body>
      <el-form :model="transferUserLeadForm" :rules="transferUserLeadFormRules" ref="transferUserLeadFormRef" label-width="120px">
        <!-- 转换用户 -->
        <el-form-item label="转换用户" prop="sourceUserId">
          <el-select v-model="transferUserLeadForm.sourceUserId" placeholder="请选择用户" clearable>
            <el-option
              v-for="dict in userOptionList"
              :key="dict.userId"
              :label="dict.nickName + ' --- ' + dict.userId"
              :value="dict.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 目标用户 -->
        <el-form-item label="目标用户" prop="targetUserId">
          <el-select v-model="transferUserLeadForm.targetUserId" placeholder="请选择用户" clearable>
            <el-option
              v-for="dict in userOptionList"
              :key="dict.userId"
              :label="dict.nickName + ' --- ' + dict.userId"
              :value="dict.userId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelTransferUserLead">取 消</el-button>
          <el-button :loading="buttonLoading" type="primary" @click="submitTransferUserLead">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Info" lang="ts">
import { InfoVO, InfoQuery, InfoForm, LeadContactForm } from '@/api/lead/info/types';
import { listInfo, getInfo, addLeadContact, updateLeadContact, reclaim, transfer, transferUserLead, reclaimUserLead } from '@/api/lead/my';
import { listOption } from '@/api/app/sys/user';
import { UserOption } from '@/api/app/sys/user/types';
import { InfoForm as ContactInfoForm } from '@/api/contact/info/types';
import * as valueCheck from '@/utils/valueCheck';

const router = useRouter();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
// 客户字典选项
const { ditalk_customer_source, ditalk_customer_industry, ditalk_lead_state, ditalk_customer_type, ditalk_customer_tier } = toRefs<any>(
  proxy?.useDict('ditalk_customer_source', 'ditalk_customer_industry', 'ditalk_lead_state', 'ditalk_customer_type', 'ditalk_customer_tier')
);
// 联系人字典选项
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

const userOptionList = ref<UserOption[]>([]);
const transferCustomerId = ref<string | number>();

// 客户表单内容
const queryFormRef = ref<ElFormInstance>();
const infoFormRef = ref<ElFormInstance>();

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
  assignedDept: undefined,
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
    assignedDept: undefined,
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

// 联系人相关
const contactFormRef = ref<ElFormInstance>(); // 添加线索时对应的联系人表单

const initContactFormData: ContactInfoForm = {
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
  state: 'ACTIVE'
};

const contactRules = ref({
  id: [{ required: true, message: 'ID不能为空', trigger: 'blur' }],
  customerId: [{ required: true, message: '客户ID不能为空', trigger: 'blur' }],
  firstName: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  state: [{ required: true, message: '状态不能为空', trigger: 'change' }]
});

// 添加线索时对应的联系人表单
const contactForm = ref<ContactInfoForm>({
  ...initContactFormData
});

// 回收指定线索的对话框变量
const transferFormRef = ref<ElFormInstance>();
const transferDialog = reactive<DialogOption>({
  visible: false,
  title: '回收线索'
});
const transferForm = reactive({
  leadIds: undefined,
  userId: undefined
});
const transferRules = ref({
  leadId: [{ required: true, message: '线索不能为空', trigger: 'blur' }],
  userId: [{ required: true, message: '目标用户不能为空', trigger: 'change' }]
});

// 回收用户所有线索的对话框变量
const reclaimUserLeadFormRef = ref<ElFormInstance>();
const reclaimUserLeadDialog = reactive<DialogOption>({
  visible: false,
  title: '回收用户所有线索'
});
const reclaimUserLeadForm = reactive({
  userId: undefined
});
const reclaimUserLeadFormRules = ref({
  userId: [{ required: true, message: '用户不能为空', trigger: 'change' }]
});

// 转移指定用户所有线索到另一用户的对话框变量
const transferUserLeadFormRef = ref<ElFormInstance>();
const transferUserLeadDialog = reactive<DialogOption>({
  visible: false,
  title: '转移指定用户所有线索到另一用户'
});
const transferUserLeadForm = reactive({
  sourceUserId: undefined,
  targetUserId: undefined
});
const transferUserLeadFormRules = ref({
  sourceUserId: [{ required: true, message: '转换用户不能为空', trigger: 'change' }],
  targetUserId: [{ required: true, message: '目标用户不能为空', trigger: 'change' }]
});

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
  contactForm.value = { ...initContactFormData };
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
  if (res.data) Object.assign(contactForm.value, res.data.contactInfo);
  dialog.visible = true;
  dialog.title = '修改线索信息';
};

/** 提交按钮 */
const submitForm = async () => {
  let flag = true;
  if (valueCheck.isNullOrUndefined(form.value.contactId)) {
    form.value.contactId = 1; // 临时值，本方法后台不使用
  }
  if (valueCheck.isNullOrUndefined(contactForm.value.customerId)) {
    contactForm.value.customerId = 1; // 临时值，本方法后台不使用
  }
  infoFormRef.value?.validate((valid: boolean) => {
    flag = flag && valid;
  });
  if (flag) {
    const leadContactForm: LeadContactForm = {
      leadInfoBo: form.value,
      contactInfoBo: contactForm.value
    };
    buttonLoading.value = true;
    if (form.value.id) {
      await updateLeadContact(leadContactForm).finally(() => (buttonLoading.value = false));
    } else {
      await addLeadContact(leadContactForm).finally(() => (buttonLoading.value = false));
    }
    proxy?.$modal.msgSuccess('操作成功');
    dialog.visible = false;
    await getList();
  }
};

onMounted(() => {
  getUserOptionList();
  getList();
});

/** 路由到联系人页面 */
const handleContactInfoList = (row: InfoVO) => {
  router.push({ path: '/contact/info-list/' + 'lead/' + row.id }); // :leadId
};

/** 路由到活动页面 */
const handleActivityInfoList = (row: InfoVO) => {
  router.push({ path: '/activity/info-list/' + 'lead/' + row.id }); // :leadId
};

/** 路由到商机页面 */
const handleOpportunityInfoList = (row: InfoVO) => {
  router.push({ path: '/opportunity/info-list/' + 'lead/' + row.id }); // :leadId
};

/** 获取用户选项列表 */
const getUserOptionList = async () => {
  await listOption({
    pageNum: 1,
    pageSize: 100
  }).then((res: { data: any }) => {
    userOptionList.value = res.data;
  });
};

/** 转移线索 */
const handleTransferLead = async (leadId?: string | number) => {
  resetTransferForm();
  transferDialog.visible = true;
  transferForm.leadIds = leadId;
};

/** 批量转移线索 */
const handleBatchTransferLead = async () => {
  resetTransferForm();
  transferDialog.visible = true;
  transferForm.leadIds = ids.value;
};

/** 回收线索 */
const reclaimLead = async (leadId?: string | number) => {
  const _ids = leadId || ids.value;
  await proxy?.$modal.confirm('确认回收编号为"' + _ids + '"的线索吗？');
  const loading = ElLoading.service({
    lock: true,
    text: '回收进行中...',
    background: 'rgba(0, 0, 0, 0.7)'
  });
  await reclaim(_ids).finally(() => loading.close());
  proxy?.$modal.msgSuccess('回收成功');
  await getList();
};

/** 重置转移线索表单 */
const resetTransferForm = () => {
  transferForm.leadIds = undefined;
  transferForm.userId = undefined;
  transferFormRef.value?.resetFields();
  transferCustomerId.value = undefined;
};

/** 取消转移线索 */
const cancelTransfer = () => {
  resetTransferForm();
  transferDialog.visible = false;
};

/** 提交转移线索 */
const submitTransfer = async () => {
  const _ids = transferForm.leadIds || ids.value;
  transferForm.leadIds = _ids;
  await proxy?.$modal.confirm('确认转移编号为"' + _ids + '"的线索吗？');
  const flag = await transferFormRef.value?.validate();
  if (flag) {
    const loading = ElLoading.service({
      lock: true,
      text: '转移进行中...',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    await transfer(transferForm.leadIds, transferForm.userId).finally(() => loading.close());
    proxy?.$modal.msgSuccess('操作成功');
    transferDialog.visible = false;
    await getList();
  }
};

/** 回收用户所有线索 */
const handleReclaimUserLead = async () => {
  resetReclaimUserLeadForm();
  reclaimUserLeadDialog.visible = true;
  reclaimUserLeadForm.userId = ids.value;
};

/** 转移用户所有线索到指定用户 */
const handleTransferUserLead = async () => {
  resetTransferUserLeadForm();
  transferUserLeadDialog.visible = true;
  transferUserLeadForm.sourceUserId = ids.value;
};

const cancelReclaimUserLead = () => {
  resetReclaimUserLeadForm();
  reclaimUserLeadDialog.visible = false;
};

const submitReclaimUserLead = async () => {
  const flag = await reclaimUserLeadFormRef.value?.validate();
  if (flag) {
    buttonLoading.value = true;
    await reclaimUserLead(reclaimUserLeadForm.userId).finally(() => (buttonLoading.value = false));
    proxy?.$modal.msgSuccess('回收成功');
    await getList();
    reclaimUserLeadDialog.visible = false;
  }
};

const cancelTransferUserLead = () => {
  resetTransferUserLeadForm();
  transferUserLeadDialog.visible = false;
};

const submitTransferUserLead = async () => {
  const flag = await transferUserLeadFormRef.value?.validate();
  if (flag) {
    buttonLoading.value = true;
    await transferUserLead(transferUserLeadForm.sourceUserId, transferUserLeadForm.targetUserId).finally(() => (buttonLoading.value = false));
    proxy?.$modal.msgSuccess('转移成功');
    await getList();
    transferUserLeadDialog.visible = false;
  }
};

const resetReclaimUserLeadForm = () => {
  reclaimUserLeadForm.userId = undefined;
  reclaimUserLeadFormRef.value?.resetFields();
};

const resetTransferUserLeadForm = () => {
  transferUserLeadForm.sourceUserId = undefined;
  transferUserLeadForm.targetUserId = undefined;
  transferUserLeadFormRef.value?.resetFields();
};
</script>
