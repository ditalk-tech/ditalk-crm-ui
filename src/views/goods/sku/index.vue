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
            <el-form-item label="商品" prop="goodsId">
              <el-select v-model="queryParams.goodsId" placeholder="请选择商品" filterable clearable>
                <el-option v-for="item in goodsInfoList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="SKU编码" prop="skuSn">
              <el-input v-model="queryParams.skuSn" placeholder="请输入SKU编码" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['goods:sku:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['goods:sku:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['goods:sku:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['goods:sku:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="skuList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" fixed="left" />
        <el-table-column label="ID" align="center" prop="id" v-if="true" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180" />
        <el-table-column label="店铺ID" align="center" prop="shopId" />
        <el-table-column label="商品ID" align="center" prop="goodsId" />
        <el-table-column label="SKU编码" align="center" prop="skuSn" />
        <el-table-column label="图片" align="center" prop="mainPicUrl" width="100">
          <template #default="scope">
            <image-preview :src="scope.row.mainPicUrl" :width="50" :height="50" />
          </template>
        </el-table-column>
        <el-table-column label="规格JSON" align="center" prop="specJson" />
        <el-table-column label="售价" align="center" prop="salePrice" />
        <el-table-column label="原价" align="center" prop="originalPrice" />
        <el-table-column label="成本价" align="center" prop="costPrice" />
        <el-table-column label="重量(kg)" align="center" prop="weight" />
        <el-table-column label="体积(m³)" align="center" prop="volume" />
        <el-table-column label="可用库存" align="center" prop="availableStock" />
        <el-table-column label="锁定库存" align="center" prop="reservedStock" />
        <el-table-column label="已占库存" align="center" prop="allocatedStock" />
        <el-table-column label="不可用库存" align="center" prop="unavailableStock" />
        <el-table-column label="总库存" align="center" prop="totalStock" />
        <el-table-column label="总销量" align="center" prop="totalSales" />
        <el-table-column label="状态" align="center" prop="state">
          <template #default="scope">
            <dict-tag :options="sys_normal_disable" :value="scope.row.state" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['goods:sku:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['goods:sku:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改商品SKU对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="960px" append-to-body>
      <el-form ref="skuFormRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="店铺" prop="shopId">
          <el-select v-model="form.shopId" placeholder="请选择店铺" @change="onChangeShopInForm" filterable>
            <el-option v-for="item in shopInfoList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品" prop="goodsId">
          <el-select v-model="form.goodsId" placeholder="请选择商品" filterable>
            <el-option v-for="item in formGoodsInfoList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="SKU编码" prop="skuSn">
          <el-input v-model="form.skuSn" placeholder="请输入SKU编码" />
        </el-form-item>
        <el-form-item label="图片" prop="mainPic">
          <image-upload v-model="form.mainPic" :limit="1" />
        </el-form-item>
        <el-form-item label="规格JSON" prop="specJson">
          <el-input v-model="form.specJson" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="售价" prop="salePrice">
          <el-input-number v-model="form.salePrice" placeholder="请输入售价" :min="0.01" :precision="2" />
        </el-form-item>
        <el-form-item label="原价" prop="originalPrice">
          <el-input-number v-model="form.originalPrice" placeholder="请输入原价" :min="0.01" :precision="2" />
        </el-form-item>
        <el-form-item label="成本价" prop="costPrice">
          <el-input-number v-model="form.costPrice" placeholder="请输入成本价" :min="0.01" :precision="2" />
        </el-form-item>
        <el-form-item label="重量(kg)" prop="weight">
          <el-input-number v-model="form.weight" placeholder="请输入重量(kg)" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="体积(m³)" prop="volume">
          <el-input-number v-model="form.volume" placeholder="请输入体积(m³)" :min="0" :precision="4" />
        </el-form-item>
        <el-form-item label="可用库存" prop="availableStock">
          <el-input-number v-model="form.availableStock" placeholder="请输入可用库存" :min="0" :precision="0" />
        </el-form-item>
        <el-form-item label="锁定库存" prop="reservedStock">
          <el-input-number v-model="form.reservedStock" placeholder="请输入锁定库存" :min="0" :precision="0" />
        </el-form-item>
        <el-form-item label="已占库存" prop="allocatedStock">
          <el-input-number v-model="form.allocatedStock" placeholder="请输入已占库存" :min="0" :precision="0" />
        </el-form-item>
        <el-form-item label="不可用库存" prop="unavailableStock">
          <el-input-number v-model="form.unavailableStock" placeholder="请输入不可用库存" :min="0" :precision="0" />
        </el-form-item>
        <el-form-item label="总库存" prop="totalStock">
          <el-input-number v-model="form.totalStock" placeholder="请输入总库存" :min="0" :precision="0" />
        </el-form-item>
        <el-form-item label="总销量" prop="totalSales">
          <el-input-number v-model="form.totalSales" placeholder="请输入总销量" :min="0" :precision="0" />
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

<script setup name="Sku" lang="ts">
import { listSku, getSku, delSku, addSku, updateSku, copySkuForm } from '@/api/goods/sku';
import { SkuVO, SkuQuery, SkuForm } from '@/api/goods/sku/types';
import { InfoOptionVO as ShopInfoOptionVO } from '@/api/shop/info/types';
import { listInfoOption as listShopInfoOption } from '@/api/shop/info';
import { InfoOptionVO as GoodsInfoOptionVO, InfoQuery as GoodsInfoQuery } from '@/api/goods/info/types';
import { listInfoOption as listGoodsInfoOption } from '@/api/goods/info';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { sys_normal_disable } = toRefs<any>(proxy?.useDict('sys_normal_disable'));

const skuList = ref<SkuVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const dateRangeCreateTime = ref<[DateModelType, DateModelType]>(['', '']);
const shopInfoList = ref<ShopInfoOptionVO[]>([]);
const goodsInfoList = ref<GoodsInfoOptionVO[]>([]);
const formGoodsInfoList = ref<GoodsInfoOptionVO[]>([]);

const queryFormRef = ref<ElFormInstance>();
const skuFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: SkuForm = {
  id: undefined,
  version: undefined,
  shopId: undefined,
  goodsId: undefined,
  skuSn: undefined,
  mainPic: undefined,
  specJson: undefined,
  salePrice: undefined,
  originalPrice: undefined,
  costPrice: undefined,
  weight: undefined,
  volume: undefined,
  availableStock: undefined,
  reservedStock: undefined,
  allocatedStock: undefined,
  unavailableStock: undefined,
  totalStock: undefined,
  totalSales: undefined,
  state: '0'
};
const data = reactive<PageData<SkuForm, SkuQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    id: undefined,
    shopId: undefined,
    goodsId: undefined,
    skuSn: undefined,
    state: undefined,
    params: {
      createTime: undefined
    }
  },
  rules: {
    id: [{ required: true, message: 'ID不能为空', trigger: 'blur' }],
    shopId: [{ required: true, message: '店铺ID不能为空', trigger: 'blur' }],
    goodsId: [{ required: true, message: '商品ID不能为空', trigger: 'blur' }],
    // skuSn: [
    //   { required: true, message: "SKU编码不能为空", trigger: "blur" }
    // ],
    salePrice: [{ required: true, message: '售价不能为空', trigger: 'blur' }],
    weight: [{ required: true, message: '重量(kg)不能为空', trigger: 'blur' }],
    volume: [{ required: true, message: '体积(m³)不能为空', trigger: 'blur' }],
    availableStock: [{ required: true, message: '可用库存不能为空', trigger: 'blur' }],
    state: [{ required: true, message: '状态不能为空', trigger: 'change' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询商品SKU列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.params = {};
  proxy?.addDateRange(queryParams.value, dateRangeCreateTime.value, 'CreateTime');
  const res = await listSku(queryParams.value);
  res.rows.forEach((row) => {
    row.salePrice = row.salePrice / 100;
    row.originalPrice = row.originalPrice / 100;
    row.costPrice = row.costPrice / 100;
    row.weight = row.weight / 100;
    row.volume = row.volume / 10000;
  });
  skuList.value = res.rows;
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
  skuFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: SkuVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加商品SKU';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: SkuVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getSku(_id);
  // Convert units
  res.data.salePrice = res.data.salePrice / 100;
  res.data.originalPrice = res.data.originalPrice / 100;
  res.data.costPrice = res.data.costPrice / 100;
  res.data.weight = res.data.weight / 100;
  res.data.volume = res.data.volume / 10000;
  //
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改商品SKU';
};

/** 提交按钮 */
const submitForm = () => {
  skuFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      const subForm = copySkuForm(form.value);
      // Convert units
      subForm.salePrice = subForm.salePrice * 100;
      subForm.originalPrice = subForm.originalPrice * 100;
      subForm.costPrice = subForm.costPrice * 100;
      subForm.weight = subForm.weight * 100;
      subForm.volume = subForm.volume * 10000;
      //
      if (subForm.id) {
        await updateSku(subForm).finally(() => (buttonLoading.value = false));
      } else {
        await addSku(subForm).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: SkuVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除商品SKU编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delSku(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'goods/sku/export',
    {
      ...queryParams.value
    },
    `sku_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getShopList();
  getList();
});

const getShopList = async () => {
  const res = await listShopInfoOption();
  shopInfoList.value = res.rows;
};

/** 获取查询条件分类下拉树结构 */
const getGoodsList = async (shopId: number | string) => {
  const query: GoodsInfoQuery = { pageNum: 1, pageSize: 1000 };
  if (!shopId) {
    return;
  }
  query.shopId = shopId;
  const res = await listGoodsInfoOption(query);
  goodsInfoList.value = res.rows;
};

const onChangeShop = (shopId: number | string) => {
  goodsInfoList.value = [];
  queryParams.value.goodsId = undefined; // remove query form value
  if (shopId) {
    getGoodsList(shopId);
  }
};

/** 获取Form中的分类下拉树结构 */
const getFormGoodsList = async (shopId: number | string) => {
  const query: GoodsInfoQuery = { pageNum: 1, pageSize: 1000 };
  if (!shopId) {
    return;
  }
  query.shopId = shopId;
  const res = await listGoodsInfoOption(query);
  formGoodsInfoList.value = res.rows;
};

const onChangeShopInForm = (shopId: number | string) => {
  formGoodsInfoList.value = [];
  form.value.goodsId = undefined; // remove data form value
  if (shopId) {
    getFormGoodsList(shopId);
  }
};
</script>
