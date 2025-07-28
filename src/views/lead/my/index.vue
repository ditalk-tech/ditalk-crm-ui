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
            <el-button type="danger" plain icon="Refresh" :disabled="multiple" @click="reclaim(null)" v-hasPermi="['lead:my:reclaim']"
              >批量回收</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Switch" :disabled="multiple" @click="transfer(null)" v-hasPermi="['lead:my:transfer']"
              >批量转移</el-button
            >
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
        <el-table-column label="线索状态" align="center" prop="leadState">
          <template #default="scope">
            <dict-tag :options="ditalk_lead_state" :value="scope.row.leadState" />
          </template>
        </el-table-column>
        <el-table-column label="分配到" align="center" prop="assignedTo" />
        <el-table-column label="分配部门" align="center" prop="assignedDept" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" :width="140" fixed="right">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleActivity(scope.row)" v-hasPermi="['lead:my:activity']">活动</el-button>
            <el-button link type="success" size="small" @click="handleUpdate(scope.row)" v-hasPermi="['lead:my:edit']">编辑</el-button>
            <el-button link size="small">
              <el-dropdown trigger="click">
                <span>更多</span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <el-button link type="danger" size="small" @click="reclaim(scope.row)" v-hasPermi="['lead:my:reclaim']">回收</el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button link type="warning" size="small" @click="transfer(scope.row)" v-hasPermi="['lead:my:transfer']">转移</el-button>
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

    <!-- 活动记录对话框 -->
    <el-dialog :title="activityDialog.title" v-model="activityDialog.visible" width="1140px" append-to-body>
      <el-row>
        <el-col :span="12">
          <el-card mr="1" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>客户信息</span>
              </div>
            </template>
            <el-form label-width="100px">
              <el-form-item label="客户名称">
                <el-input v-model="form.name" disabled />
              </el-form-item>
              <el-form-item label="客户类型">
                <el-select v-model="form.type" disabled>
                  <el-option v-for="dict in ditalk_customer_type" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="联系人姓名">
                <el-input :value="contactForm.lastName + ' ' + contactForm.firstName" disabled />
              </el-form-item>
              <el-form-item label="性别" prop="gender">
                <el-select v-model="contactForm.gender" disabled>
                  <el-option v-for="dict in sys_user_sex" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="线索状态">
                <el-select v-model="form.leadState" disabled>
                  <el-option v-for="dict in ditalk_lead_state" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="联系电话">
                <el-input v-model="contactForm.phone" disabled />
              </el-form-item>
              <el-form-item label="电子邮箱">
                <el-input v-model="contactForm.email" disabled />
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card ml="1" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>登记活动信息</span>
              </div>
            </template>
            <el-form ref="activityFormRef" :model="activityForm" :rules="activityRules" label-width="120px">
              <el-form-item label="联系人" prop="contactId">
                <el-select v-model="activityForm.contactId" placeholder="请选择联系人">
                  <el-option
                    v-for="dict in contactInfoOptionList"
                    :key="dict.id"
                    :label="dict.lastName + ' ' + dict.firstName + ' --- ' + dict.id"
                    :value="dict.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="主题" prop="subject">
                <el-input v-model="activityForm.subject" placeholder="请输入主题" />
              </el-form-item>
              <el-form-item label="活动类型" prop="type">
                <el-select v-model="activityForm.type" placeholder="请选择活动类型">
                  <el-option v-for="dict in ditalk_customer_activity_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="描述内容" prop="description">
                <el-input v-model="activityForm.description" type="textarea" placeholder="请输入内容" />
              </el-form-item>
              <el-form-item label="活动时间" prop="activityTime">
                <el-date-picker
                  clearable
                  v-model="activityForm.activityTime"
                  type="datetime"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择活动时间"
                >
                </el-date-picker>
              </el-form-item>
              <template :v-show="false">
                <el-form-item label="客户ID" prop="customerId">
                  <el-input v-model="activityForm.customerId" placeholder="请输入客户ID" />
                </el-form-item>
                <!-- <el-form-item label="联系人ID" prop="contactId">
                  <el-input v-model="activityForm.contactId" placeholder="请输入联系人ID" />
                </el-form-item> -->
                <el-form-item label="商机ID" prop="opportunityId">
                  <el-input v-model="activityForm.opportunityId" placeholder="请输入商机ID" />
                </el-form-item>
              </template>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane label="活动记录" name="activityList">
          <el-table v-loading="loading" border :data="activityList">
            <el-table-column label="ID" align="center" prop="id" v-if="true" />
            <el-table-column label="主题" align="center" prop="subject" />
            <el-table-column label="描述内容" align="center" prop="description" width="360" />
            <!-- <el-table-column label="商机ID" align="center" prop="opportunityId" /> -->
            <el-table-column label="联系人姓名" align="center" prop="contactName" />
            <el-table-column label="活动类型" align="center" prop="type">
              <template #default="scope">
                <dict-tag :options="ditalk_customer_activity_type" :value="scope.row.type" />
              </template>
            </el-table-column>
            <el-table-column label="活动时间" align="center" prop="activityTime" />
            <el-table-column label="创建时间" align="center" prop="createTime" />
            <el-table-column label="创建人ID" align="center" prop="createBy" />
          </el-table>
          <pagination
            v-show="activityTotal > 0"
            :total="activityTotal"
            v-model:page="activityQueryParams.pageNum"
            v-model:limit="activityQueryParams.pageSize"
            @pagination="getActivityList(form.id)"
          />
        </el-tab-pane>
        <el-tab-pane label="联系人" name="second">
          <el-table v-loading="loading" border :data="contactInfoList">
            <el-table-column label="ID" align="center" prop="id" v-if="true" />
            <el-table-column label="创建时间" align="center" prop="createTime" width="180" />
            <el-table-column label="客户ID" align="center" prop="customerId" />
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
            <!-- <el-table-column label="备注信息" align="center" prop="remark" />
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
            <el-table-column label="分配部门" align="center" prop="assignedDept" /> -->
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
              <template #default="scope">
                <el-tooltip content="详情" placement="top">
                  <el-button link type="primary" icon="Postcard" @click="showContactInfo(scope.row)" v-hasPermi="['contact:info:query']"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="contactInfoTotal > 0"
            :total="contactInfoTotal"
            v-model:page="contactInfoQueryParams.pageNum"
            v-model:limit="contactInfoQueryParams.pageSize"
            @pagination="getContactInfoList(form.id)"
          />
        </el-tab-pane>
        <!-- <el-tab-pane label="备注" name="third">备注</el-tab-pane> -->
      </el-tabs>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitActivityForm">确 定</el-button>
          <el-button @click="cancelActivity">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 活动记录中联系人详情弹窗 -->
    <el-dialog :title="contactInfoDialog.title" v-model="contactInfoDialog.visible" width="960px" append-to-body>
      <el-form ref="contactInfoFormRef" :model="contactInfoForm" :rules="rules" label-width="120px">
        <el-form-item label="客户ID" prop="customerId">
          <el-input v-model="contactInfoForm.customerId" placeholder="请输入客户ID" disabled />
        </el-form-item>
        <el-form-item label="姓氏" prop="lastName">
          <el-input v-model="contactInfoForm.lastName" placeholder="请输入姓氏" disabled />
        </el-form-item>
        <el-form-item label="名称" prop="firstName">
          <el-input v-model="contactInfoForm.firstName" placeholder="请输入名称" disabled />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <!-- <image-upload v-model="contactInfoForm.avatar" :limit="1" disabled /> -->
          <image-preview :src="contactInfoForm.avatarUrl" :width="50" :height="50" />
        </el-form-item>
        <el-form-item label="姓名拼音" prop="pinyin">
          <el-input v-model="contactInfoForm.pinyin" placeholder="请输入姓名拼音" disabled />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="contactInfoForm.gender" disabled>
            <el-radio v-for="dict in sys_user_sex" :key="dict.value" :value="dict.value">{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="contactInfoForm.email" placeholder="请输入电子邮箱" disabled />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="contactInfoForm.phone" placeholder="请输入联系电话" disabled />
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input v-model="contactInfoForm.position" placeholder="请输入职位" disabled />
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input v-model="contactInfoForm.remark" type="textarea" placeholder="请输入内容" disabled />
        </el-form-item>
        <el-form-item label="分配到" prop="assignedTo">
          <el-input v-model="contactInfoForm.assignedTo" placeholder="请输入分配到" disabled />
        </el-form-item>
        <el-form-item label="分配部门" prop="assignedDept">
          <el-input v-model="contactInfoForm.assignedDept" placeholder="请输入分配部门" disabled />
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker
            clearable
            v-model="contactInfoForm.birthday"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择生日"
            disabled
          />
        </el-form-item>
        <el-form-item label="户籍" prop="placeOfOrigin">
          <el-input v-model="contactInfoForm.placeOfOrigin" placeholder="请输入户籍" disabled />
        </el-form-item>
        <el-form-item label="居住地" prop="address">
          <el-input v-model="contactInfoForm.address" placeholder="请输入居住地" disabled />
        </el-form-item>
        <el-form-item label="毕业学校" prop="graduationSchool">
          <el-input v-model="contactInfoForm.graduationSchool" placeholder="请输入毕业学校" disabled />
        </el-form-item>
        <el-form-item label="学历" prop="qualification">
          <el-select v-model="contactInfoForm.qualification" placeholder="请选择学历" disabled>
            <el-option v-for="dict in ditalk_educational_qualification" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="社会角色" prop="socialRole">
          <el-input v-model="contactInfoForm.socialRole" placeholder="请输入社会角色" disabled />
        </el-form-item>
        <el-form-item label="最近接触时间" prop="lastContactTime">
          <el-date-picker
            clearable
            v-model="contactInfoForm.lastContactTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择最近接触时间"
            disabled
          />
        </el-form-item>
        <el-form-item label="接触频率" prop="contactFrequency" clearable>
          <el-select v-model="contactInfoForm.contactFrequency" placeholder="请选择接触频率" disabled>
            <el-option v-for="dict in ditalk_contact_frequency" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="微信" prop="wechat">
          <el-input v-model="contactInfoForm.wechat" placeholder="请输入微信" disabled />
        </el-form-item>
        <el-form-item label="QQ" prop="qq">
          <el-input v-model="contactInfoForm.qq" placeholder="请输入QQ" disabled />
        </el-form-item>
        <el-form-item label="钉钉" prop="dingTalk">
          <el-input v-model="contactInfoForm.dingTalk" placeholder="请输入钉钉" disabled />
        </el-form-item>
        <el-form-item label="飞书" prop="lark">
          <el-input v-model="contactInfoForm.lark" placeholder="请输入飞书" disabled />
        </el-form-item>
        <el-form-item label="WhatsApp" prop="whatsApp">
          <el-input v-model="contactInfoForm.whatsApp" placeholder="请输入WhatsApp" disabled />
        </el-form-item>
        <el-form-item label="Facebook" prop="facebook">
          <el-input v-model="contactInfoForm.facebook" placeholder="请输入Facebook" disabled />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-radio-group v-model="contactInfoForm.state" disabled>
            <el-radio v-for="dict in ditalk_contact_state" :key="dict.value" :value="dict.value">{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeContactInfoDialog">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Info" lang="ts">
import { listInfo, getInfo, addLeadContact, updateLeadContact } from '@/api/lead/my';
import { InfoVO, InfoQuery, InfoForm, LeadContactForm } from '@/api/lead/info/types';
import { listOption, getMyInfo } from '@/api/app/sys/user';
import { UserOption } from '@/api/app/sys/user/types';
import { InfoVO as ContactInfoVO, InfoForm as ContactInfoForm, InfoOptionVO as ContactInfoOptionVO } from '@/api/contact/info/types';
import { getInfo as getContactInfo, listInfo as listContactInfo, listInfoOption as listContactOptionInfo } from '@/api/contact/info';
import * as valueCheck from '@/utils/valueCheck';
import { listActivity, addActivity } from '@/api/customer/activity';
import { ActivityVO, ActivityQuery, ActivityForm } from '@/api/customer/activity/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
// 客户字典选项
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
// 联系人字典选项
const { ditalk_educational_qualification, ditalk_contact_frequency, ditalk_contact_state, sys_user_sex } = toRefs<any>(
  proxy?.useDict('ditalk_educational_qualification', 'ditalk_contact_frequency', 'ditalk_contact_state', 'sys_user_sex')
);
// 活动字典选项
const { ditalk_customer_activity_type } = toRefs<any>(proxy?.useDict('ditalk_customer_activity_type'));

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
const contactInfoList = ref<ContactInfoVO[]>([]); // 活动对话框中的联系人列表
const contactFormRef = ref<ElFormInstance>(); // 添加线索时对应的联系人表单
const contactInfoFormRef = ref<ElFormInstance>(); // 活动对话框中的联系人详情表单
const contactInfoOptionList = ref<ContactInfoOptionVO[]>([]); // 联系人详情选项列表

const contactInfoQueryParams = ref({
  pageNum: 1,
  pageSize: 10,
  customerId: undefined
});
const contactInfoTotal = ref(0);

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

// 活动管理中的联系人详情表单
const contactInfoForm = ref<ContactInfoForm>({
  ...initContactFormData
});

// 活动相关变量
const activityTotal = ref(0);
const activityQueryParams = ref({
  pageNum: 1,
  pageSize: 10,
  customerId: undefined
});

const activityList = ref<ActivityVO[]>([]);
const activityFormRef = ref<ElFormInstance>();

const activityDialog = reactive<DialogOption>({
  visible: false,
  title: '活动记录管理'
});

const contactInfoDialog = reactive<DialogOption>({
  visible: false,
  title: '联系人详情'
});

const activeTab = ref<string>('activityList'); // 活动对话框中的选项卡

const initActivityFormData: ActivityForm = {
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

const activityRules = ref({
  id: [{ required: true, message: 'ID不能为空', trigger: 'blur' }],
  customerId: [{ required: true, message: '客户ID不能为空', trigger: 'blur' }],
  contactId: [{ required: true, message: '联系人ID不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '活动类型不能为空', trigger: 'change' }],
  subject: [{ required: true, message: '主题不能为空', trigger: 'blur' }],
  description: [{ required: true, message: '描述内容不能为空', trigger: 'blur' }]
});

const activityForm = ref<ActivityForm>({
  ...initActivityFormData
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
  contactFormRef.value?.resetFields();
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
  contactFormRef.value?.validate((valid: boolean) => {
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
const transfer = (row: InfoVO) => {
  proxy?.$modal.notifyWarning('待完成');
};

/** 回收线索 */
const reclaim = (row: InfoVO) => {
  proxy?.$modal.notifyWarning('待完成');
};

/**
 * 打开活动对话框
 * @param row 线索信息
 */
const handleActivity = async (row: InfoVO) => {
  resetActivityForm();
  const _id = row?.id || ids.value[0];
  const res = await getInfo(_id);
  Object.assign(form.value, res.data);
  if (res.data) Object.assign(contactForm.value, res.data.contactInfo);
  // 填充活动记录
  activityForm.value.customerId = form.value.id;
  activityForm.value.contactId = contactForm.value.id;
  activityDialog.visible = true;
  // 读取活动记录历史
  getActivityList(form.value.id);
  // 填充联系人信息
  getContactInfoList(form.value.id);
  // 填充联系人详情选项列表
  getContactInfoOptionList(form.value.id);
};

/** 读取活动记录历史 */
const getActivityList = async (customerId: number | string) => {
  activityQueryParams.value.customerId = customerId;
  const activityRes = await listActivity(activityQueryParams.value);
  activityTotal.value = activityRes.total;
  activityList.value = activityRes.rows;
};

/** 提交新增活动表单 */
const submitActivityForm = async () => {
  activityFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      await addActivity(activityForm.value).finally(() => (buttonLoading.value = false));
      proxy?.$modal.msgSuccess('操作成功');
      activityDialog.visible = false;
    }
  });
};

/** 关闭活动对话框 */
const cancelActivity = () => {
  resetActivityForm();
  activityDialog.visible = false;
};

/** 重置活动对话框表单 */
const resetActivityForm = () => {
  form.value = { ...initFormData };
  contactForm.value = { ...initContactFormData };
  activityForm.value = { ...initActivityFormData };
  infoFormRef.value?.resetFields();
  contactFormRef.value?.resetFields();
  // 重置活动对话框中的 联系人数据
  contactInfoList.value = [];
  contactInfoQueryParams.value.pageNum = 1;
  // 重置活动对话框中的 联系人数据
  activityFormRef.value?.resetFields();
  activityList.value = [];
  activityQueryParams.value.pageNum = 1;
  // 重置活动对话框中的 tab 值
  activeTab.value = 'activityList';
};

/** 获取联系人列表 */
const getContactInfoList = async (customerId: number | string) => {
  contactInfoQueryParams.value.customerId = customerId;
  const contactInfoRes = await listContactInfo(contactInfoQueryParams.value);
  contactInfoTotal.value = contactInfoRes.total;
  contactInfoList.value = contactInfoRes.rows;
};

/** 联系人详情 */
const showContactInfo = async (row: ContactInfoVO) => {
  resetContactInfoForm();
  const res = await getContactInfo(row.id);
  Object.assign(contactInfoForm.value, res.data);
  contactInfoDialog.visible = true;
};

/** 联系人详情关闭 */
const closeContactInfoDialog = () => {
  contactInfoDialog.visible = false;
  resetContactInfoForm();
};

/** 活动对话框中的联系人详情表单重置 */
const resetContactInfoForm = () => {
  contactInfoForm.value = { ...initContactFormData };
  contactInfoFormRef.value?.resetFields();
};

/** 获取联系人详情选项列表 */
const getContactInfoOptionList = async (customerId: number | string) => {
  const res = await listContactOptionInfo(customerId);
  contactInfoOptionList.value = res.data;
};
</script>
