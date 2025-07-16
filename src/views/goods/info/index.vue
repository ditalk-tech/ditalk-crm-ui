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
    <el-dialog v-model="dialog.visible" width="1320px" append-to-body style="min-height: 92%;" :show-close="false" @close="onCloseDialog">
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
                    @change="onChangeCategory"
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
                <el-input v-model="specKeyArray[index]" placeholder="规格名称" style="width: 200px; margin-bottom: 3px; margin-right: 20px;" @blur="checkForDuplicateKeys(specKeyArray[index])" />
                <el-button type="info" plain @click="delSpecRow(index)">删 除</el-button>
              </el-row>
              <el-input-tag v-model="specValueArray[index]" placeholder="规格选项" style="margin-bottom: 16px" draggable @add-tag="checkForDeplicateValues(index)" />
              </template>
              <el-button type="primary" plain @click="addSpecRow">添加规格</el-button>
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
          <!-- 展示 specArray 内容 -->
          <el-row>
            <el-col :span="2" align="right">
              <b style="margin-right: 10px">规格集</b>
            </el-col>
            <el-col :span="22">
              <template v-for="(v, index) in specKeyArray" :key="index">
              <el-row>
                <el-input v-model="specKeyArray[index]" placeholder="规格名称" style="width: 200px; margin-bottom: 3px; margin-right: 20px;" @blur="checkForDuplicateKeys(specKeyArray[index])" />
                <el-button type="default" @click="delSpecRow(index)">删 除</el-button>
              </el-row>
              <el-input-tag v-model="specValueArray[index]" placeholder="规格选项" style="margin-bottom: 16px" draggable @add-tag="checkForDeplicateValues(index)" />
              </template>
              <el-button type="primary" plain @click="addSpecRow">添加规格</el-button>
              <el-button type="success" plain @click="refreshSkuList">立即生成规格</el-button>
              <el-button type="danger" plain @click="clearSkuForm">清空商品规格</el-button>
            </el-col>
          </el-row>
          <!-- 展示已有的 GoodsSku 数据，并支持更新保存 -->
          <el-row style="margin-top:20px">
            <el-col :span="2" align="right">
              <b style="margin-right: 10px">商品规格</b>
            </el-col>
            <el-col :span="22">
              <el-table border :data="skuList">
                <template v-for="(spec, index) in skuSpecTableHead" :key="index">
                  <el-table-column :label="spec" align="center" prop="specObject" fixed="left">
                    <template #default="scope">
                      {{ scope.row.specObject[spec] }}
                    </template>
                  </el-table-column>
                </template>
                <el-table-column label="图片" align="center" v-if="showImageUploadColumn">
                  <template #default="scope">
                    <image-upload-one v-model="scope.row.mainPic" />
                  </template>
                </el-table-column>
                <el-table-column label="售价" align="center" prop="salePrice" width="120">
                  <template #default="scope">
                    <el-input-number v-model="scope.row.salePrice" :min="0" :precision="2" :controls="false" style="width: 100%"></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column label="原价" align="center" prop="originalPrice" width="120">
                  <template #default="scope">
                    <el-input-number v-model="scope.row.originalPrice" :min="0" :precision="2" :controls="false" style="width: 100%"></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column label="成本价" align="center" prop="costPrice" width="120">
                  <template #default="scope">
                    <el-input-number v-model="scope.row.costPrice" :min="0" :precision="2" :controls="false" style="width: 100%"></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column label="重量(kg)" align="center" prop="weight" width="100">
                  <template #default="scope">
                    <el-input-number v-model="scope.row.weight" :min="0" :precision="2" :controls="false" style="width: 100%"></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column label="体积(m³)" align="center" prop="volume" width="120">
                  <template #default="scope">
                    <el-input-number v-model="scope.row.volume" :min="0" :precision="4" :controls="false" style="width: 100%"></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column label="可用库存" align="center" prop="availableStock" width="100">
                  <template #default="scope">
                    <el-input-number v-model="scope.row.availableStock" :min="0" :precision="0" :controls="false" style="width: 100%"></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column label="SKU编码" align="center" prop="skuSn" width="160">
                  <template #default="scope">
                    <el-input v-model="scope.row.skuSn"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="90" fixed="right">
                  <template #default="scope">
                    <el-button @click="skuList.splice(scope.$index, 1)">删 除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup name="Info" lang="ts">
// InfoForm 处理 Goods 的基础信息，InfoContentForm 处理 Goods 的 content 内容，content 是从 InfoForm 复制到 InfoContentForm 的，来源同是 InfoVO。InfoForm 与 InfoConentForm 是同一个数据实体，所有 version 需要保持一致。
// form 是处理 Goods 基础信息的，contentForm 是处理 content 内容的。skuForm 处理 SKU 相关定义的。
// 本页面是 GoodsInfo 为主体，引入了 GoodsSku 的内容，目的是使入口统一到 GoodsInfo 身上。
// attrArray 与 specArray 是 attrJson 与 specJson 的变量载体，用于页面数据双向绑定。最后提交后台时，attrArray 与 specArray 转型并传入到 form 中。
import { listInfo, getInfo, delInfo, addInfo, updateInfo, updateInfoContent } from '@/api/goods/info';
import { InfoVO, InfoQuery, InfoForm, InfoContentForm } from '@/api/goods/info/types';
import { listSku, initSkuVO, batchUpdateSku } from '@/api/goods/sku';
import { SkuVO, SkuQuery, SkuForm, SkuBatchForm } from '@/api/goods/sku/types';
import { listSkuSpecByShopIdAndCategoryId } from '@/api/goods/skuSpec';
import { SkuSpecVO } from '@/api/goods/skuSpec/types';
import { InfoOptionVO as ShopInfoOptionVO } from '@/api/shop/info/types';
import { listInfoOption as listShopInfoOption } from '@/api/shop/info';
import { CategoryTreeVO, CategoryQuery } from '@/api/goods/category/types';
import { getTreeSelect } from '@/api/goods/category';
import { BrandVO } from '@/api/goods/brand/types';
import { listBrand } from '@/api/goods/brand';
import * as handleRes from '@/utils/handleRes';
import * as valueCheck from '@/utils/valueCheck';

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
const categoryOptions = ref<CategoryTreeVO[]>([]); // 页面查询条件的 category 选项集合
const formCategoryOptions = ref<CategoryTreeVO[]>([]); // form表单中的 category 选项集合

const queryFormRef = ref<ElFormInstance>();
const infoFormRef = ref<ElFormInstance>();
const contentFormRef = ref<ElFormInstance>();
const currentTab = ref<string>('tab0'); // 对话框中 tab 默认值
const needRefresh = ref<Boolean>(false); // 控制GoodsInfo列表刷新时机，管理当编辑对话框关闭时是否有需要刷新
const attrArray = ref<string[]>([]); // 对应商品属性中的 attrJson
const specArray = ref<any>({}); // 对应商品属性中的 specJson
const specKeyArray = ref<string[]>(); // 规格名称数组
const specValueArray = ref<string[][]>([]); // 规格名称对应的规格值集合
const skuList = ref<SkuVO[]>([]); // 页面展示的 Sku 列表数据，也作为 skuFormList 中的数据准备
const skuSpecArray = ref<string[][]>([]) // 通过预定义规格生成的 skuSpec 集合，格式为 [["颜色:白","产地:中国"],["颜色:白","产地:USA"],["颜色:金","产地:中国"],["颜色:金","产地:USA"]]
const skuFormList = ref<SkuForm[]>([]) // 管理 sku 提交的数据集合，从 skuList 中获取数据
const skuSpecTableHead = ref<string[]>([]) // 在 SkuForm 数据表格中管理动态表头
const showImageUploadColumn = ref<Boolean>(false) // 使 SkuForm 数据表格 ImageUpload 在最后加载，解决会加载多次，多个请求后台的问题
// 单位转换
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

const initContentFormData: InfoContentForm = {
  id: undefined,
  version: undefined,
  content: undefined,
}

const { queryParams, form, rules } = toRefs(data);
const contentForm = ref<InfoContentForm>() // contentForm 与 form 的 version 与 id 应该对应一致

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
}

/** 表单重置 */
const reset = () => {
  // 控制 GoodsInfo 列表刷新
  if (needRefresh.value) {
    getList();
    needRefresh.value = false
  }
  // 重置 tab index
  currentTab.value = 'tab0' 
  // GoodsInfo 列表刷新标记
  needRefresh.value = false
  // 重置 Sku 表格 ImageUpload 最后加载
  showImageUploadColumn.value = false
  // 重置 form 中的 category 选项
  formCategoryOptions.value = []
  // 重置对话框用到的变量
  attrArray.value = []
  specArray.value = {}
  specKeyArray.value = []
  specValueArray.value = []
  skuList.value = []
  skuSpecArray.value = []
  skuFormList.value = []
  skuSpecTableHead.value = []
  // 重置 goods infoForm 表单
  form.value = {...initFormData};
  // 重置 goods contentForm 表单
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
  // 读取分类树 列表选项使用
  await getFormCategoryTree(form.value.shopId);
  // 处理单位转换
  minPrice.value = form.value.minPrice / 100;
  // 初始化contentForm，需要与form相对应，同步form到contentForm
  syncFormToContentForm()
  // 处理普通属性
  handleAttrArray()
  // 处理规格属性
  await handleSpecArray()
  // 加载 SKU 列表数据
  await handleSkuList()
  // 构建 SKU 表格动态表头
  buildSkuSpecTableHead()
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

/**
 * 保存Goods的详情信息
 */
const saveInfo = () => {
  // 参数格式转换
  form.value.attrJson = array2json(attrArray.value);
  form.value.specJson = buildSpecArray();
  // 单位转换
  form.value.minPrice = minPrice.value * 100;
  // 保存数据
  infoFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      let res: any;
      if (form.value.id) {
        res = await updateInfo(form.value)
      } else {
        res = await addInfo(form.value)
      }
      handleRes.showMsg(res)
      form.value.version = res.data.version; // 每次操作需要同步更新 version
      contentForm.value.id = form.value.id
      contentForm.value.version = res.data.version; // 每次操作需要同步更新 version
      needRefresh.value = true
      currentTab.value = "tab1"
      buttonLoading.value = false
    }
  });
}

/**
 * 保存Goods的内容描述
 */
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

/**
 * 保存 SKU 信息
 */
const saveSku = () => {
  // 表单校验
  for (const sku of skuList.value) {
    if (valueCheck.isNullOrUndefined(sku.mainPic) || sku.mainPic === 0) {
      proxy?.$modal.msgError("请上传SKU主图");
      return
    }
  }
  buttonLoading.value = true;
  // skuList 转换到 skuFormList
  skuFormList.value = []
  skuList.value.forEach(sku => {
    skuFormList.value.push({
      id: sku.id,
      version: sku.version,
      skuSn: sku.skuSn,
      mainPic: sku.mainPic,
      specJson: sku.specJson,
      salePrice: sku.salePrice * 100,
      originalPrice: sku.originalPrice * 100,
      costPrice: sku.costPrice * 100,
      weight: sku.weight * 100,
      volume: sku.volume * 10000,
      availableStock: sku.availableStock,
    })
  })
  // 提交保存
  const skuBatchForm: SkuBatchForm = {
      goodsId: form.value.id,
      shopId: form.value.shopId,
      goodsSkuBos: skuFormList.value,
  }
  batchUpdateSku(skuBatchForm).then(res => {
    handleRes.showMsg(res);
  }).finally(() => {
    buttonLoading.value = false
  });
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
const checkForDuplicateKeys = (value: string) => {
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
const checkForDeplicateValues = (index: number) => {
  if (specValueArray.value[index].slice(0, -1).indexOf(specValueArray.value[index].at(-1)) != -1) {
    proxy?.$modal.msgError("规格值重复了");
    specValueArray.value[index].pop();
  }
}

/**
 * 刷新 SkuList 内容
 */
const refreshSkuList = () => {
  buildSkuSpecArray()
  buildSkuSpecTableHead()
  mergeIntoSkuList()
}

/**
 * 把 skuSpecArray 存在 skuList 没有的，合并到 skuList，保留原来有的 skuList 内容
 */
const mergeIntoSkuList = () => {
  // skuList.value = [] // 创建、合并到 skuList 中
  skuSpecArray.value.forEach(spec => {
    const specObject = Object.fromEntries( // 如把 ["颜色:白","产地:中国"] 转成 {颜色:白,产地:中国}
        spec.map(item => item.split(':'))
    );
    // 判断 skuList 中有没有 specJson 等于 spec 的 sku
    let sku = skuList.value.find(sku => valueCheck.isEqualObject(JSON.parse(sku.specJson), specObject));
    if (sku) {
      return // 有则跳过
    } else {
      sku = initSkuVO(); // 没有则创建
      sku['specObject'] = specObject
      // sku.specJson = JSON.stringify(spec); // 数组格式
      sku.specJson = JSON.stringify(specObject); // 对象格式
      sku.shopId = form.value.shopId; // 必要的 shopId 属性值
      sku.goodsId = form.value.id; // 必要的 goodsId 属性值
      sku.state = "0"; // 必要的状态属性值
      skuList.value.push(sku);
    }
  })
}

/**
 * 构建 skuSpecArray 数据
 */
const buildSkuSpecArray = () => {
  skuSpecArray.value = cartesianProduct(
    specKeyArray.value.map((key, index) => { // 将 specKey 与 specValue 合并成 key:value 的数组
      return specValueArray.value[index].map(value => `${key}:${value}`);
    })
  )
}

/**
 * 构建 SKU 表格动态表头
 */
const buildSkuSpecTableHead = () => {
  // 如果现存 SKU 后台记录，从 SKU 后台记录构建出 spec 对象集合
  const specObjectArray: Object[] = skuList.value.flatMap(sku => sku['specObject']) // 格式：[{颜色:白,产地:中国},{颜色:红,产地:中国}]
  // 【1】从后台记录构建动态表头
  skuSpecTableHead.value = getObjectKeys(specObjectArray)
  // 【2】从定义集合构建动态表头，并与【1】后台记录合并成全量表头
  skuSpecTableHead.value = [...new Set([...skuSpecTableHead.value, ...specKeyArray.value])]
  // !!! 特别处理：动态表头会使表单加载两次数据，对于 image-upload 要请求两次后台。这里把 image-upload 也放到动态表头中，使其只加载一次
  showImageUploadColumn.value = true
}

/**
 * 笛卡尔乘积
 * @param arr 笛卡尔乘积的参数数组
 * @returns 笛卡尔乘积的结果数组
 */
const cartesianProduct = <T>(arr: T[][]): T[][] => 
  arr.reduce((acc: T[][], current: T[]) => {
    if (acc.length === 0) {
      return current.map(item => [item]);
    }
    return acc.flatMap(prev =>
      current.map(currentItem => [...prev, currentItem])
    );
  }, [] as T[][])

/**
 * 从对象数组中提取所有唯一的属性名（包括所有对象的键）
 * @typeparam T - 数组元素的类型，必须是对象类型
 * @param arr - 要提取属性名的对象数组
 * @returns 包含所有唯一属性名的字符串数组，顺序由首次出现决定
 * @example
 * const users = [{ name: 'Alice' }, { age: 30 }];
 * const keys = getObjectKeys(users); // ['name', 'age']
 */
const getObjectKeys = <T extends object>(arr: T[]): string[] => {
  return [...new Set(
    arr.reduce((keys, obj) => [...keys, ...Object.keys(obj)], [] as string[])
  )];
};

/**
 * 清除 Sku 表格数据
 */
const clearSkuForm = () => {
  skuSpecTableHead.value = []
  skuList.value = []
}

/**
 * 关闭对话框
 */
const onCloseDialog = () => {
  reset()
}

/**
 * 处理普通属性
 */
const handleAttrArray = () => {
  attrArray.value = json2array(form.value.attrJson);
}

/**
 * 处理规格属性
 * 
 * GoodsInfo 中有 specJson 内容，取 specJson 值进行展示；
 * GoodsInfo 中没有 specJson 内容，取分类中预定义值。
 */
const handleSpecArray = async () => {
  specArray.value = []
  specKeyArray.value = []
  specValueArray.value = []
  if (form.value.specJson && form.value.specJson !== "{}" && form.value.specJson !== "") { // GoodsInfo 中有 specJson 内容，取 specJson 值进行展示
    specArray.value = JSON.parse(form.value.specJson || "{}")
  } else { // GoodsInfo 中没有 specJson 内容，取分类中预定义值
    const goodsSkuSpecRes = await listSkuSpecByShopIdAndCategoryId(form.value.shopId, form.value.categoryId)
    const goodsSkuSpecList: SkuSpecVO[] = goodsSkuSpecRes.data
    // 把 goodsSkuSpecList 转成 specArray
    if (!valueCheck.isEmptyArr(goodsSkuSpecList)) {
      goodsSkuSpecList.forEach(skuSpec => {
        specArray.value[skuSpec.name] = JSON.parse(skuSpec.specJson || "")
      })
    } else {
      specArray.value = {}
    }
  }
  for (const key in specArray.value) { // 把规格中的 key 与 values 分别取出到 specKeyArray 与 specValueArray，便后续处理
    if (specArray.value.hasOwnProperty(key)) { // 可选：过滤掉继承的属性
      specKeyArray.value.push(key)
      specValueArray.value.push(specArray.value[key])
    }
  }
}

/**
 * 同步 form 到 contentForm
 */
const syncFormToContentForm = () => {
  contentForm.value.id = form.value.id;
  contentForm.value.version = form.value.version;
  contentForm.value.content = form.value.content;
}

/**
 * 加载数据到 skuList
 */
const handleSkuList = async () => {
  skuList.value = []
  const skuQuery: SkuQuery = {
    shopId: form.value.shopId,
    goodsId: form.value.id,
    pageNum: 1,
    pageSize: 1000,
    state: "0",
  }
  const skuListRes = await listSku(skuQuery);
  skuListRes.rows.forEach(row => {
    row.salePrice = row.salePrice / 100;
    row.originalPrice = row.originalPrice / 100;
    row.costPrice = row.costPrice / 100;
    row.weight = row.weight / 100;
    row.volume = row.volume / 10000;
    row['specObject'] = JSON.parse(row.specJson);
    skuList.value.push(row);
  })
}

/**
 * 分类改变处理
 */
const onChangeCategory = () => {
  handleSpecArray()
}

</script>
