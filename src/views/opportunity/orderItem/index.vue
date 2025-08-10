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
            <el-form-item label="店铺ID" prop="shopId">
              <el-input v-model="queryParams.shopId" placeholder="请输入店铺ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="客户ID" prop="customerId">
              <el-input v-model="queryParams.customerId" placeholder="请输入客户ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="商品快照ID" prop="goodsSnapshotId">
              <el-input v-model="queryParams.goodsSnapshotId" placeholder="请输入商品快照ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="商品快照ID" prop="skuId">
              <el-input v-model="queryParams.skuId" placeholder="请输入商品快照ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="SKU编码" prop="skuSn">
              <el-input v-model="queryParams.skuSn" placeholder="请输入SKU编码" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['opportunity:orderItem:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['opportunity:orderItem:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['opportunity:orderItem:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['opportunity:orderItem:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="orderItemList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" fixed="left" />
        <el-table-column label="ID" align="center" prop="id" v-if="true" />
        <el-table-column label="创建时间" align="center" prop="createTime" />
        <el-table-column label="商机ID" align="center" prop="opportunityId" />
        <el-table-column label="店铺ID" align="center" prop="shopId" />
        <el-table-column label="客户ID" align="center" prop="customerId" />
        <el-table-column label="商品快照ID" align="center" prop="goodsSnapshotId" />
        <el-table-column label="商品快照ID" align="center" prop="skuId" />
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
        <el-table-column label="单价" align="center" prop="unitPrice" />
        <el-table-column label="购买数量" align="center" prop="quantity" />
        <el-table-column label="总价" align="center" prop="totalPrice" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['opportunity:orderItem:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['opportunity:orderItem:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改商机商品对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="960px" append-to-body>
      <el-form ref="orderItemFormRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="商机ID" prop="opportunityId">
          <el-input v-model="form.opportunityId" placeholder="请输入商机ID" />
        </el-form-item>
        <el-form-item label="店铺ID" prop="shopId">
          <el-input v-model="form.shopId" placeholder="请输入店铺ID" />
        </el-form-item>
        <el-form-item label="客户ID" prop="customerId">
          <el-input v-model="form.customerId" placeholder="请输入客户ID" />
        </el-form-item>
        <el-form-item label="商品快照ID" prop="goodsSnapshotId">
          <el-input v-model="form.goodsSnapshotId" placeholder="请输入商品快照ID" />
        </el-form-item>
        <el-form-item label="商品快照ID" prop="skuId">
          <el-input v-model="form.skuId" placeholder="请输入商品快照ID" />
        </el-form-item>
        <el-form-item label="SKU编码" prop="skuSn">
          <el-input v-model="form.skuSn" placeholder="请输入SKU编码" />
        </el-form-item>
        <el-form-item label="图片" prop="mainPic">
          <image-upload v-model="form.mainPic" :limit="1" />
        </el-form-item>
        <el-form-item label="规格JSON" prop="specJson">
          <el-input v-model="form.specJson" placeholder="请输入规格JSON" />
        </el-form-item>
        <el-form-item label="售价" prop="salePrice">
          <el-input v-model="form.salePrice" placeholder="请输入售价" />
        </el-form-item>
        <el-form-item label="原价" prop="originalPrice">
          <el-input v-model="form.originalPrice" placeholder="请输入原价" />
        </el-form-item>
        <el-form-item label="成本价" prop="costPrice">
          <el-input v-model="form.costPrice" placeholder="请输入成本价" />
        </el-form-item>
        <el-form-item label="重量(kg)" prop="weight">
          <el-input v-model="form.weight" placeholder="请输入重量(kg)" />
        </el-form-item>
        <el-form-item label="体积(m³)" prop="volume">
          <el-input v-model="form.volume" placeholder="请输入体积(m³)" />
        </el-form-item>
        <el-form-item label="单价" prop="unitPrice">
          <el-input v-model="form.unitPrice" placeholder="请输入单价" />
        </el-form-item>
        <el-form-item label="购买数量" prop="quantity">
          <el-input v-model="form.quantity" placeholder="请输入购买数量" />
        </el-form-item>
        <el-form-item label="总价" prop="totalPrice">
          <el-input v-model="form.totalPrice" placeholder="请输入总价" />
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

<script setup name="OrderItem" lang="ts">
import { listOrderItem, getOrderItem, delOrderItem, addOrderItem, updateOrderItem } from '@/api/opportunity/orderItem';
import { OrderItemVO, OrderItemQuery, OrderItemForm } from '@/api/opportunity/orderItem/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const orderItemList = ref<OrderItemVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const dateRangeCreateTime = ref<[DateModelType, DateModelType]>(['', '']);

const queryFormRef = ref<ElFormInstance>();
const orderItemFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: OrderItemForm = {
  id: undefined,
  version: undefined,
  opportunityId: undefined,
  shopId: undefined,
  customerId: undefined,
  goodsSnapshotId: undefined,
  skuId: undefined,
  skuSn: undefined,
  mainPic: undefined,
  specJson: undefined,
  salePrice: undefined,
  originalPrice: undefined,
  costPrice: undefined,
  weight: undefined,
  volume: undefined,
  unitPrice: undefined,
  quantity: undefined,
  totalPrice: undefined
};
const data = reactive<PageData<OrderItemForm, OrderItemQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    id: undefined,
    opportunityId: undefined,
    shopId: undefined,
    customerId: undefined,
    goodsSnapshotId: undefined,
    skuId: undefined,
    skuSn: undefined,
    params: {
      createTime: undefined
    }
  },
  rules: {
    id: [{ required: true, message: 'ID不能为空', trigger: 'blur' }],
    opportunityId: [{ required: true, message: '商机ID不能为空', trigger: 'blur' }],
    shopId: [{ required: true, message: '店铺ID不能为空', trigger: 'blur' }],
    customerId: [{ required: true, message: '客户ID不能为空', trigger: 'blur' }],
    goodsSnapshotId: [{ required: true, message: '商品快照ID不能为空', trigger: 'blur' }],
    skuId: [{ required: true, message: '商品快照ID不能为空', trigger: 'blur' }],
    mainPic: [{ required: true, message: '图片不能为空', trigger: 'blur' }],
    specJson: [{ required: true, message: '规格JSON不能为空', trigger: 'blur' }],
    salePrice: [{ required: true, message: '售价不能为空', trigger: 'blur' }],
    weight: [{ required: true, message: '重量(kg)不能为空', trigger: 'blur' }],
    volume: [{ required: true, message: '体积(m³)不能为空', trigger: 'blur' }],
    unitPrice: [{ required: true, message: '单价不能为空', trigger: 'blur' }],
    quantity: [{ required: true, message: '购买数量不能为空', trigger: 'blur' }],
    totalPrice: [{ required: true, message: '总价不能为空', trigger: 'blur' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询商机商品列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.params = {};
  proxy?.addDateRange(queryParams.value, dateRangeCreateTime.value, 'CreateTime');
  const res = await listOrderItem(queryParams.value);
  orderItemList.value = res.rows;
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
  orderItemFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: OrderItemVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加商机商品';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: OrderItemVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getOrderItem(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改商机商品';
};

/** 提交按钮 */
const submitForm = () => {
  orderItemFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateOrderItem(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addOrderItem(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: OrderItemVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除商机商品编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delOrderItem(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'opportunity/orderItem/export',
    {
      ...queryParams.value
    },
    `orderItem_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
