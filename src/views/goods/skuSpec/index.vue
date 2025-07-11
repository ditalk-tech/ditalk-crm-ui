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
            <el-form-item label="店铺" prop="shopId">
              <el-select v-model="queryParams.shopId" placeholder="请选择店铺" @change="onChangeShop" filterable clearable>
                <el-option v-for="item in shopInfoList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="分类" prop="categoryId">
              <el-tree-select
                v-model="queryParams.categoryId"
                :data="categoryOptions"
                :props="{ value: 'id', label: 'label', children: 'children' } as any"
                value-key="id"
                placeholder="先选店铺才能选分类"
                check-strictly
                filterable
                clearable
              />
            </el-form-item>
            <el-form-item label="规格名称" prop="name">
              <el-input v-model="queryParams.name" placeholder="请输入规格名称" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['goods:skuSpec:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['goods:skuSpec:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['goods:skuSpec:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['goods:skuSpec:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="skuSpecList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" fixed="left" />
        <el-table-column label="ID" align="center" prop="id" v-if="true" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180" />
        <el-table-column label="店铺ID" align="center" prop="shopId" />
        <el-table-column label="类目ID" align="center" prop="categoryId" />
        <el-table-column label="规格名称" align="center" prop="name" />
        <el-table-column label="规格集" align="center" prop="specJson" />
        <el-table-column label="排序" align="center" prop="sortOrder" />
        <el-table-column label="状态" align="center" prop="state">
          <template #default="scope">
            <dict-tag :options="sys_normal_disable" :value="scope.row.state"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['goods:skuSpec:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['goods:skuSpec:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改SKU规格对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="960px" append-to-body>
      <el-form ref="skuSpecFormRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="店铺" prop="shopId">
          <el-select v-model="form.shopId" placeholder="请选择店铺" @change="onChangeShopInForm" filterable>
            <el-option v-for="item in shopInfoList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类" prop="categoryId">
          <el-tree-select
                v-model="form.categoryId"
                :data="formCategoryOptions"
                :props="{ value: 'id', label: 'label', children: 'children' } as any"
                value-key="id"
                placeholder="请选择分类"
                check-strictly
                filterable
              />
        </el-form-item>
        <el-form-item label="规格名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入规格名称" />
        </el-form-item>
        <el-form-item label="规格选项集">
          <el-input-tag v-model="specArray" placeholder="输入后回车" draggable @add-tag="addSpecTag"/>
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

<script setup name="SkuSpec" lang="ts">
import { listSkuSpec, getSkuSpec, delSkuSpec, addSkuSpec, updateSkuSpec } from '@/api/goods/skuSpec';
import { SkuSpecVO, SkuSpecQuery, SkuSpecForm } from '@/api/goods/skuSpec/types';
import { InfoVO as ShopInfoVO } from '@/api/shop/info/types';
import { listInfo as listShopInfo } from '@/api/shop/info';
import { CategoryTreeVO, CategoryQuery } from '@/api/goods/category/types';
import { getTreeSelect } from '@/api/goods/category';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { sys_normal_disable } = toRefs<any>(proxy?.useDict('sys_normal_disable'));

const skuSpecList = ref<SkuSpecVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const dateRangeCreateTime = ref<[DateModelType, DateModelType]>(['', '']);
const shopInfoList = ref<ShopInfoVO[]>([]);
const categoryOptions = ref<CategoryTreeVO[]>([]); // 查询条件里的
const formCategoryOptions = ref<CategoryTreeVO[]>([]); // 表单里的
const specArray = ref<string[]>([]);

const queryFormRef = ref<ElFormInstance>();
const skuSpecFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: SkuSpecForm = {
  id: undefined,
  version: undefined,
  shopId: undefined,
  categoryId: undefined,
  name: undefined,
  specJson: undefined,
  sortOrder: undefined,
  state: "0"
}
const data = reactive<PageData<SkuSpecForm, SkuSpecQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    id: undefined,
    shopId: undefined,
    categoryId: undefined,
    name: undefined,
    state: undefined,
    params: {
      createTime: undefined,
    }
  },
  rules: {
    id: [
      { required: true, message: "ID不能为空", trigger: "blur" }
    ],
    shopId: [
      { required: true, message: "店铺ID不能为空", trigger: "blur" }
    ],
    categoryId: [
      { required: true, message: "类目ID不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "规格名称不能为空", trigger: "blur" }
    ],
    state: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询SKU规格列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.params = {};
  proxy?.addDateRange(queryParams.value, dateRangeCreateTime.value, 'CreateTime');
  const res = await listSkuSpec(queryParams.value);
  skuSpecList.value = res.rows;
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
  skuSpecFormRef.value?.resetFields();
  //
  specArray.value = [];
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
const handleSelectionChange = (selection: SkuSpecVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加SKU规格";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: SkuSpecVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getSkuSpec(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改SKU规格";
  //
  await getFormCategoryTree(form.value.shopId);
  specArray.value = JSON.parse(form.value.specJson || '[]');
}

/** 提交按钮 */
const submitForm = () => {
  //
  form.value.specJson = JSON.stringify(specArray.value);
  //
  skuSpecFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateSkuSpec(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addSkuSpec(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: SkuSpecVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除SKU规格编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delSkuSpec(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('goods/skuSpec/export', {
    ...queryParams.value
  }, `skuSpec_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getShopList();
  // getCategoryTree()
  getList();
});

const getShopList = async () => {
  const res = await listShopInfo();
  shopInfoList.value = res.rows;
}

const addSpecTag = (value: string) => {
  // 如果 value 已在 specArray 中存在，忽略该值
  if (specArray.value.slice(0, -1).indexOf(value) != -1) {
    proxy?.$modal.msgError("标签重复了");
    specArray.value.pop();
    return;
  }
}

/** 获取查询条件分类下拉树结构 */
const getCategoryTree = async (shopId: number | string) => {
  const query: CategoryQuery = {}
  if (!shopId) {
    return
  }
  query.shopId = shopId
  const res = await getTreeSelect(query)
  categoryOptions.value = res.data
};

const onChangeShop = (shopId: number | string) => {
  categoryOptions.value = []
  queryParams.value.categoryId = undefined // remove query form value
  if (shopId) {
    getCategoryTree(shopId);
  }
}

/** 获取Form中的分类下拉树结构 */
const getFormCategoryTree = async (shopId: number | string) => {
  const query: CategoryQuery = {}
  if (!shopId) {
    return
  }
  query.shopId = shopId
  const res = await getTreeSelect(query)
  formCategoryOptions.value = res.data
}

const onChangeShopInForm = (shopId: number | string) => {
  formCategoryOptions.value = []
  form.value.categoryId = undefined // remove data form value
  if (shopId) {
    getFormCategoryTree(shopId);
  }
}

</script>
