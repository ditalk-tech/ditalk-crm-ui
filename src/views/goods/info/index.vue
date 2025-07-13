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
            <el-form-item label="编码" prop="spuCode">
              <el-input v-model="queryParams.spuCode" placeholder="请输入编码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="名称" prop="name">
              <el-input v-model="queryParams.name" placeholder="请输入名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="条形码" prop="barCode">
              <el-input v-model="queryParams.barCode" placeholder="请输入条形码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="品牌" prop="brandId">
              <el-select v-model="queryParams.brandId" placeholder="请选择品牌" filterable>
                <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="state">
              <el-select v-model="queryParams.state" placeholder="请选择状态" clearable >
                <el-option v-for="dict in ditalk_goods_state" :key="dict.value" :label="dict.label" :value="dict.value"/>
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['goods:info:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['goods:info:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['goods:info:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['goods:info:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="infoList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" fixed="left" />
        <el-table-column label="ID" align="center" prop="id" v-if="true" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180" />
        <el-table-column label="店铺ID" align="center" prop="shopId" />
        <el-table-column label="分类ID" align="center" prop="categoryId" />
        <el-table-column label="编码" align="center" prop="spuCode" />
        <el-table-column label="名称" align="center" prop="name" />
        <el-table-column label="属性集" align="center" prop="attrJson" width="120" show-overflow-tooltip />
        <el-table-column label="规格集" align="center" prop="specJson" width="120" show-overflow-tooltip />
        <el-table-column label="副标题" align="center" prop="subtitle" width="120" show-overflow-tooltip />
        <el-table-column label="主图" align="center" prop="mainPicUrl" width="100">
          <template #default="scope">
            <image-preview :src="scope.row.mainPicUrl" :width="50" :height="50"/>
          </template>
        </el-table-column>
        <el-table-column label="轮播图组" align="center" prop="subPicsUrl" width="180">
          <template #default="scope">
            <multiple-image-preview :src="scope.row.subPicsUrl" :width="30" :height="30"/>
          </template>
        </el-table-column>
        <el-table-column label="条形码" align="center" prop="barCode" />
        <el-table-column label="品牌ID" align="center" prop="brandId" />
        <!-- <el-table-column label="商品说明" align="center" prop="content" /> -->
        <el-table-column label="最低价" align="center" prop="minPrice" >
          <template #default="scope">
            {{scope.row.minPrice / 100}}
          </template>
        </el-table-column>
        <el-table-column label="总销量" align="center" prop="totalSales" />
        <el-table-column label="可用库存" align="center" prop="availableStock" />
        <el-table-column label="综合评分" align="center" prop="overallScore" />
        <el-table-column label="排序" align="center" prop="sortOrder" />
        <el-table-column label="状态" align="center" prop="state">
          <template #default="scope">
            <dict-tag :options="ditalk_goods_state" :value="scope.row.state"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['goods:info:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['goods:info:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改商品信息对话框 -->
    <el-dialog v-model="dialog.visible" width="960px" append-to-body style="min-height: 92%;" :show-close="false">
      <template #header>
        <el-row align="middle">
          <el-col :span="18">
            <el-text tag="b" size="large">{{ dialog.title }}</el-text>
          </el-col>
          <el-col :span="6">
            <el-button :loading="buttonLoading" type="primary" plain v-if="currentTab === 'tab0'" @click="saveInfo">保存并下一步</el-button>
            <el-button :loading="buttonLoading" type="primary" plain v-if="currentTab === 'tab1'" @click="saveContent">保存并下一步</el-button>
            <el-button :loading="buttonLoading" type="primary" plain v-if="currentTab === 'tab2'" @click="saveSku">保 存</el-button>
            <el-button @click="cancel">关 闭</el-button>
          </el-col>
        </el-row>
      </template>
      <el-tabs type="border-card" v-model="currentTab">
        <el-tab-pane label="基础信息" name="tab0">
          <el-form ref="infoFormRef" :model="form" :rules="rules" label-width="120px">
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
            <el-form-item label="品牌" prop="brandId">
              <el-select v-model="form.brandId" placeholder="请选择品牌" filterable>
                <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="编码" prop="spuCode">
                  <el-input v-model="form.spuCode" placeholder="请输入编码" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="条形码" prop="barCode">
                  <el-input v-model="form.barCode" placeholder="请输入条形码" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入名称" />
            </el-form-item>
            <el-form-item label="副标题" prop="subtitle">
              <el-input v-model="form.subtitle" placeholder="请输入副标题" />
            </el-form-item>
            <el-form-item label="主图" prop="mainPic">
              <image-upload v-model="form.mainPic" :limit="1"/>
            </el-form-item>
            <el-form-item label="轮播图组" prop="subPics">
              <image-upload v-model="form.subPics"/>
            </el-form-item>
            <el-form-item label="属性集">
              <el-input-tag v-model="attrArray" placeholder="输入后回车，格式 '属性名:属性值'" draggable @add-tag="addAttrTag" />
            </el-form-item>
            <el-form-item label="规格集" prop="specJson">
              <template v-for="(v, index) in specKeyArray" :key="index">
              <el-row>
                <el-input v-model="specKeyArray[index]" placeholder="规格名称" style="width: 200px; margin-bottom: 3px; margin-right: 20px;" @blur="check4duplicateKeys(specKeyArray[index])" />
                <el-button type="default" @click="delSpecRow(index)">删 除</el-button>
              </el-row>
              <el-input-tag v-model="specValueArray[index]" placeholder="规格选项" style="margin-bottom: 16px" draggable @add-tag="check4deplicateValues(index)" />
              </template>
              <el-button type="default" @click="addSpecRow">添加规格</el-button>
            </el-form-item>
            <el-form-item label="状态" prop="state">
              <el-radio-group v-model="form.state">
                <el-radio
                  v-for="dict in ditalk_goods_state"
                  :key="dict.value"
                  :value="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="最低价" prop="minPrice">
                  <el-input-number v-model="minPrice" placeholder="请输入最低价" :min="0.01" :precision="2" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="总销量" prop="totalSales">
                  <el-input-number v-model="form.totalSales" placeholder="请输入总销量" :min="0" :precision="0" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="可用库存" prop="availableStock">
                  <el-input-number v-model="form.availableStock" placeholder="请输入可用库存" :min="0" :precision="0" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="综合评分" prop="overallScore">
                  <el-space>
                    <el-input-number v-model="form.overallScore" placeholder="请输入综合评分" :min="0" :max="10" :precision="0" />
                    <el-tooltip content="0-10 分" placement="top"><el-icon><QuestionFilled /></el-icon></el-tooltip>
                  </el-space>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="排序" prop="sortOrder">
                  <el-input-number v-model="form.sortOrder" placeholder="请输入排序" :min="0" :max="99999999" :precision="0" />
                </el-form-item>
              </el-col>
              <el-col :span="12"></el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="详情描述" name="tab1">
          <el-form ref="contentFormRef" :model="contentForm" :rules="contentRules" label-width="120px">
            <el-form-item label="商品说明">
              <editor v-model="contentForm.content" :min-height="680" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="SKU定义" name="tab2">
          <el-form ref="skuFormRef" :model="skuForm" :rules="skuRules" label-width="120px">
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup name="Info" lang="ts">
import { listInfo, getInfo, delInfo, addInfo, updateInfo, updateInfoContent } from '@/api/goods/info';
import { InfoVO, InfoQuery, InfoForm, InfoContentForm } from '@/api/goods/info/types';
import { listSku, getSku, delSku, addSku, updateSku } from '@/api/goods/sku';
import { SkuVO, SkuQuery, SkuForm } from '@/api/goods/sku/types';
import { InfoOptionVO as ShopInfoOptionVO } from '@/api/shop/info/types';
import { listInfoOption as listShopInfoOption } from '@/api/shop/info';
import { CategoryTreeVO, CategoryQuery } from '@/api/goods/category/types';
import { getTreeSelect } from '@/api/goods/category';
import { BrandVO } from '@/api/goods/brand/types';
import { listBrand } from '@/api/goods/brand';
import * as handleRes from '@/utils/handleRes';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { ditalk_goods_state } = toRefs<any>(proxy?.useDict('ditalk_goods_state'));

const infoList = ref<InfoVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const dateRangeCreateTime = ref<[DateModelType, DateModelType]>(['', '']);
const shopInfoList = ref<ShopInfoOptionVO[]>([]);
const brandList = ref<BrandVO[]>([]);
const categoryOptions = ref<CategoryTreeVO[]>([]);
const formCategoryOptions = ref<CategoryTreeVO[]>([]);
const needRefresh = ref<Boolean>(false);

const queryFormRef = ref<ElFormInstance>();
const infoFormRef = ref<ElFormInstance>();
const contentFormRef = ref<ElFormInstance>();
const skuFormRef = ref<ElFormInstance>();
const attrArray = ref<string[]>([]);
const specKeyArray = ref<string[]>();
const specValueArray = ref<string[][]>([]);
const specArray = ref<any>({});
const currentTab = ref<string>('tab0')
const minPrice = ref<number>(0); // 用于提交时转换为分

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: InfoForm = {
  id: undefined,
  version: undefined,
  shopId: undefined,
  categoryId: undefined,
  spuCode: undefined,
  name: undefined,
  subtitle: undefined,
  mainPic: undefined,
  subPics: undefined,
  barCode: undefined,
  brandId: undefined,
  content: undefined,
  minPrice: undefined,
  totalSales: undefined,
  availableStock: undefined,
  overallScore: undefined,
  sortOrder: undefined,
  attrJson: undefined,
  specJson: undefined,
  state: "off_shelf"
}
const data = reactive<PageData<InfoForm, InfoQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    id: undefined,
    shopId: undefined,
    categoryId: undefined,
    spuCode: undefined,
    name: undefined,
    barCode: undefined,
    brandId: undefined,
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
      { required: true, message: "店铺不能为空", trigger: "blur" }
    ],
    categoryId: [
      { required: true, message: "分类不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "名称不能为空", trigger: "blur" }
    ],
    mainPic: [
      { required: true, message: "主图不能为空", trigger: "blur" }
    ],
    // minPrice: [
    //   { required: true, message: "最低价不能为空", trigger: "blur" }
    // ],
    // totalSales: [
    //   { required: true, message: "总销量不能为空", trigger: "blur" }
    // ],
    // availableStock: [
    //   { required: true, message: "可用库存不能为空", trigger: "blur" }
    // ],
    // overallScore: [
    //   { required: true, message: "综合评分不能为空", trigger: "blur" }
    // ],
    // sortOrder: [
    //   { required: true, message: "排序不能为空", trigger: "blur" }
    // ],
    state: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ]
  }
});

const contentRules: ElFormRules = {
  id: [
    { required: true, message: "请先保存商品信息", trigger: "blur" }
  ]
}

const skuRules: ElFormRules = {
  id: [
    { required: true, message: "ID不能为空", trigger: "blur" }
  ]
}

const initContentFormData: InfoContentForm = {
  id: undefined,
  version: undefined,
  content: undefined,
}

const { queryParams, form, rules } = toRefs(data);
const contentForm = ref<InfoContentForm>() // contentForm 与 form 的 version 与 id 应该对应一致
const skuForm = ref<SkuForm>()

/** 查询商品信息列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.params = {};
  proxy?.addDateRange(queryParams.value, dateRangeCreateTime.value, 'CreateTime');
  const res = await listInfo(queryParams.value);
  infoList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
  //
  if (needRefresh.value) {
    getList();
    needRefresh.value = false
  }
  currentTab.value = 'tab0' // 关闭 dialog 时重置 tab index
}

/** 表单重置 */
const reset = () => {
  //
  minPrice.value = undefined
  attrArray.value = []
  specArray.value = {}
  specKeyArray.value = []
  specValueArray.value = []
  //
  formCategoryOptions.value = []
  //
  form.value = {...initFormData};
  contentForm.value = {...initContentFormData}
  infoFormRef.value?.resetFields();
  contentFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: InfoVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加商品信息";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: InfoVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getInfo(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改商品信息";
  //
  attrArray.value = json2array(form.value.attrJson); // 处理普通属性
  specArray.value = JSON.parse(form.value.specJson || "{}") // 处理规格属性
  for (const key in specArray.value) {
    if (specArray.value.hasOwnProperty(key)) { // 可选：过滤掉继承的属性
      specKeyArray.value.push(key)
      specValueArray.value.push(specArray.value[key])
    }
  }
  // 处理金额单位
  minPrice.value = form.value.minPrice / 100;
  // get category tree
  getFormCategoryTree(form.value.shopId);
  // 初始化 contentForm
  contentForm.value.id = form.value.id;
  contentForm.value.version = form.value.version;
  contentForm.value.content = form.value.content;
}

/** 删除按钮操作 */
const handleDelete = async (row?: InfoVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除商品信息编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delInfo(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('goods/info/export', {
    ...queryParams.value
  }, `info_${new Date().getTime()}.xlsx`);
}

onMounted(() => {
  getShopList();
  getBrandList();
  // getCategoryTree(null)
  getList();
});

const getShopList = async () => {
  const res = await listShopInfoOption();
  shopInfoList.value = res.rows;
}

const getBrandList = async () => {
  const res = await listBrand();
  brandList.value = res.rows;
}

/**
 * @description: json字符串转数组
 * @param {string} json
 * @return {string[]}
 */
const json2array = (json: string): string[] => {
  try {
    const parsedObj = JSON.parse(json);
    return Object.entries(parsedObj).map(([key, value]) => `${key}:${value}`);
  } catch (error) {
    console.error('Error parsing attrJson:', error);
    return [];
  }
}

/**
 * @description: 与 json2array 相反的操作
 * @param {string[]} array
 * @return {string}
 */
const array2json = (array: string[]): string => {
  try {
    const parsedObj = array.reduce((acc, cur) => {
      const [key, value] = cur.split(':');
      acc[key] = value;
      return acc;
    }, {});
    return JSON.stringify(parsedObj);
  } catch (error) {
    console.error('Error parsing attrJson:', error);
    return '';
  }
}

/**
 * @description: 新增属性标签，格式要求 属性名:属性值。
 * @param value 
 */
const addAttrTag = (value: string) => {
  // 组件默认会值进行 trim 操作
  // 把所有：转换成:
  if (value.indexOf('：') != -1) {
    value = value.replaceAll('：', ':');
    attrArray.value.pop();
    attrArray.value.push(value);
  }
  // 值中需要有一个:符号 同时 :符号两边不能为空字符串
  if (value.indexOf(':') == -1 || value.indexOf(':') == 0 || value.indexOf(':') == value.length - 1) {
    proxy?.$modal.msgError("请输入 属性名:属性值 格式");
    attrArray.value.pop();
    return;
  }
  // 不能有多个:符号
  if (value.split(':').length > 2) {
    proxy?.$modal.msgError("请输入 属性名:属性值 格式，不能有多个:符号");
    attrArray.value.pop();
    return;
  }
  // 如果attrArray中排除最后一个数据，有与value相同值忽略value
  if (attrArray.value.slice(0, -1).indexOf(value) != -1) {
    proxy?.$modal.msgError("标签重复了");
    attrArray.value.pop();
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
};

const onChangeShopInForm = (shopId: number | string) => {
  formCategoryOptions.value = []
  form.value.categoryId = undefined // remove data form value
  if (shopId) {
    getFormCategoryTree(shopId);
  }
}

const saveInfo = () => {
  //
  form.value.attrJson = array2json(attrArray.value);
  form.value.specJson = buildSpecArray();
  form.value.minPrice = minPrice.value * 100;
  //
  infoFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        updateInfo(form.value).then((res) => {
          if (handleRes.showMsg(res)) {
            form.value.version = res.data.version; // 每次操作需要同步更新 version
            contentForm.value.id = form.value.id
            contentForm.value.version = res.data.version; // 每次操作需要同步更新 version
            needRefresh.value = true
            currentTab.value = "tab1"
          }
        }).finally(() => {
          buttonLoading.value = false
        })
      } else {
        addInfo(form.value).then((res) => {
          if (handleRes.showMsg(res)) {
            form.value.id = res.data.id;
            form.value.version = res.data.version; // 每次操作需要同步更新 version
            contentForm.value.id = res.data.id;
            contentForm.value.version = res.data.version; // 每次操作需要同步更新 version
            needRefresh.value = true
            currentTab.value = "tab1"
          }
        }).finally(() => {
          buttonLoading.value = false
        })
      }
    }
  });
}

const saveContent = async () => {
  contentFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      updateInfoContent(contentForm.value).then(res => {
        if (handleRes.showMsg(res)) {
          contentForm.value.version = res.data.version; // 每次操作需要同步更新 version
          form.value.version = res.data.version; // 每次操作需要同步更新 version
          // needRefresh.value = true 更新 content 不用更新表格
          currentTab.value = "tab2"
        }
      }).finally(() => {
        buttonLoading.value = false
      });
    }
  })
}

const saveSku = () => {
}

/**
 * @description: 构建规格数组的JSON字符串
 * @return {string}
 */
const buildSpecArray = (): string => {
  specArray.value = {}
  for (let i = 0; i < specKeyArray.value.length; i++) {
    if (!specKeyArray.value[i] || specKeyArray.value[i].trim() === '' || specValueArray.value[i].length == 0) { // 去除没有值的规格项
      continue
    }
    specArray.value[specKeyArray.value[i]] = specValueArray.value[i]
  }
  return JSON.stringify(specArray.value)
}

/**
 * 添加新的 规格项
 */
const addSpecRow = () => {
  specKeyArray.value.push(undefined)
  specValueArray.value.push([]);
}

/**
 * 删除规格项集合中指定项
 * @param index 
 */
const delSpecRow = (index: number) => {
  specKeyArray.value.splice(index, 1)
  specValueArray.value.splice(index, 1)
}

/**
 * 在specKeyArray中排除最后一个项，检查若有与value相同值的忽略value
 * @param value 
 * @param index 
 */
const check4duplicateKeys = (value: string) => {
  if (specKeyArray.value.slice(0, -1).indexOf(value) != -1) {
    proxy?.$modal.msgError("规格名重复了");
    specKeyArray.value.pop();
  }
}

/**
 * 检查specValueArray[index]中最后一个值是否已存在，存在则删除
 * @param value 
 * @param index 
 */
const check4deplicateValues = (index: number) => {
  if (specValueArray.value[index].slice(0, -1).indexOf(specValueArray.value[index].at(-1)) != -1) {
    proxy?.$modal.msgError("规格值重复了");
    specValueArray.value[index].pop();
  }
}

</script>
