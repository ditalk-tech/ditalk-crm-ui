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
            <el-form-item label="名称" prop="name">
              <el-input v-model="queryParams.name" placeholder="请输入名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="英文名称" prop="englishName">
              <el-input v-model="queryParams.englishName" placeholder="请输入英文名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="所属国家" prop="country">
              <el-input v-model="queryParams.country" placeholder="请输入所属国家" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="官网" prop="website">
              <el-input v-model="queryParams.website" placeholder="请输入官网" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="状态" prop="state">
              <el-select v-model="queryParams.state" placeholder="请选择状态" clearable >
                <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value"/>
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['goods:brand:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['goods:brand:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['goods:brand:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['goods:brand:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="brandList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" fixed="left" />
        <el-table-column label="ID" align="center" prop="id" v-if="true" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180" />
        <el-table-column label="名称" align="center" prop="name" />
        <el-table-column label="英文名称" align="center" prop="englishName" />
        <el-table-column label="Logo" align="center" prop="logoUrl" width="100">
          <template #default="scope">
            <image-preview :src="scope.row.logoUrl" :width="50" :height="50"/>
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center" prop="description" />
        <el-table-column label="所属国家" align="center" prop="country" />
        <el-table-column label="官网" align="center" prop="website" />
        <el-table-column label="排序" align="center" prop="sortOrder" />
        <el-table-column label="状态" align="center" prop="state">
          <template #default="scope">
            <dict-tag :options="sys_normal_disable" :value="scope.row.state"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['goods:brand:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['goods:brand:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改商品品牌信息对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="960px" append-to-body>
      <el-form ref="brandFormRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="英文名称" prop="englishName">
          <el-input v-model="form.englishName" placeholder="请输入英文名称" />
        </el-form-item>
        <el-form-item label="Logo" prop="logo">
          <image-upload v-model="form.logo"/>
        </el-form-item>
        <el-form-item label="描述" prop="description">
            <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="所属国家" prop="country">
          <el-input v-model="form.country" placeholder="请输入所属国家" />
        </el-form-item>
        <el-form-item label="官网" prop="website">
          <el-input v-model="form.website" placeholder="请输入官网" />
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input-number v-model="form.sortOrder" placeholder="请输入排序" :min="0" :max="99999999" :precision="0" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-radio-group v-model="form.state">
            <el-radio
              v-for="dict in sys_normal_disable"
              :key="dict.value"
              :value="dict.value"
            >{{dict.label}}</el-radio>
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

<script setup name="Brand" lang="ts">
import { listBrand, getBrand, delBrand, addBrand, updateBrand } from '@/api/goods/brand';
import { BrandVO, BrandQuery, BrandForm } from '@/api/goods/brand/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { sys_normal_disable } = toRefs<any>(proxy?.useDict('sys_normal_disable'));

const brandList = ref<BrandVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const dateRangeCreateTime = ref<[DateModelType, DateModelType]>(['', '']);

const queryFormRef = ref<ElFormInstance>();
const brandFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: BrandForm = {
  id: undefined,
  version: undefined,
  name: undefined,
  englishName: undefined,
  logo: undefined,
  description: undefined,
  country: undefined,
  website: undefined,
  sortOrder: undefined,
  state: "0"
}
const data = reactive<PageData<BrandForm, BrandQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    id: undefined,
    name: undefined,
    englishName: undefined,
    country: undefined,
    website: undefined,
    state: undefined,
    params: {
      createTime: undefined,
    }
  },
  rules: {
    id: [
      { required: true, message: "ID不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "名称不能为空", trigger: "blur" }
    ],
    state: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询商品品牌信息列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.params = {};
  proxy?.addDateRange(queryParams.value, dateRangeCreateTime.value, 'CreateTime');
  const res = await listBrand(queryParams.value);
  brandList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  brandFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  dateRangeCreateTime.value = ['', ''];
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: BrandVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加商品品牌信息";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: BrandVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getBrand(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改商品品牌信息";
}

/** 提交按钮 */
const submitForm = () => {
  brandFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateBrand(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addBrand(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: BrandVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除商品品牌信息编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delBrand(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('goods/brand/export', {
    ...queryParams.value
  }, `brand_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
