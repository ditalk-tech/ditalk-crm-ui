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
            <el-form-item label="商品ID" prop="goodsId">
              <el-input v-model="queryParams.goodsId" placeholder="请输入商品ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="店铺ID" prop="shopId">
              <el-input v-model="queryParams.shopId" placeholder="请输入店铺ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="分类ID" prop="categoryId">
              <el-input v-model="queryParams.categoryId" placeholder="请输入分类ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="编码" prop="spuCode">
              <el-input v-model="queryParams.spuCode" placeholder="请输入编码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="名称" prop="name">
              <el-input v-model="queryParams.name" placeholder="请输入名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="副标题" prop="subtitle">
              <el-input v-model="queryParams.subtitle" placeholder="请输入副标题" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="条形码" prop="barCode">
              <el-input v-model="queryParams.barCode" placeholder="请输入条形码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="品牌ID" prop="brandId">
              <el-input v-model="queryParams.brandId" placeholder="请输入品牌ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="状态" prop="state">
              <el-select v-model="queryParams.state" placeholder="请选择状态" clearable>
                <el-option v-for="dict in ditalk_goods_state" :key="dict.value" :label="dict.label" :value="dict.value" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['goods:infoSnapshot:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['goods:infoSnapshot:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['goods:infoSnapshot:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['goods:infoSnapshot:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="infoSnapshotList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" fixed="left" />
        <el-table-column label="ID" align="center" prop="id" v-if="true" />
        <el-table-column label="创建时间" align="center" prop="createTime" />
        <el-table-column label="商品ID" align="center" prop="goodsId" />
        <el-table-column label="店铺" align="center" prop="shopName" />
        <el-table-column label="分类" align="center" prop="categoryName" />
        <el-table-column label="编码" align="center" prop="spuCode" />
        <el-table-column label="名称" align="center" prop="name" />
        <el-table-column label="副标题" align="center" prop="subtitle" />
        <el-table-column label="主图" align="center" prop="mainPicUrl" width="100">
          <template #default="scope">
            <image-preview :src="scope.row.mainPicUrl" :width="50" :height="50" />
          </template>
        </el-table-column>
        <el-table-column label="轮播图" align="center" prop="subPicsUrl" width="180">
          <template #default="scope">
            <multiple-image-preview :src="scope.row.subPicsUrl" :width="30" :height="30" />
          </template>
        </el-table-column>
        <el-table-column label="条形码" align="center" prop="barCode" />
        <el-table-column label="品牌" align="center" prop="brandName" />
        <!-- <el-table-column label="商品说明" align="center" prop="content" /> -->
        <el-table-column label="最低价" align="center" prop="minPrice">
          <template #default="scope">
            {{ scope.row.minPrice / 100 }}
          </template>
        </el-table-column>
        <el-table-column label="综合评分" align="center" prop="overallScore" />
        <el-table-column label="属性JSON" align="center" prop="attrJson" width="240">
          <template #default="scope">
            <el-tooltip :content="scope.row.attrJson" placement="top" :show-after="300">
              <p class="descStyle">{{ scope.row.attrJson }}</p>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="规格JSON" align="center" prop="specJson" width="240">
          <template #default="scope">
            <el-tooltip :content="scope.row.specJson" placement="top" :show-after="300">
              <p class="descStyle">{{ scope.row.specJson }}</p>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="state">
          <template #default="scope">
            <dict-tag :options="ditalk_goods_state" :value="scope.row.state" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['goods:infoSnapshot:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['goods:infoSnapshot:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改商品信息快照对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="960px" append-to-body>
      <el-form ref="infoSnapshotFormRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="商品ID" prop="goodsId">
          <el-input v-model="form.goodsId" placeholder="请输入商品ID" />
        </el-form-item>
        <el-form-item label="店铺ID" prop="shopId">
          <el-input v-model="form.shopId" placeholder="请输入店铺ID" />
        </el-form-item>
        <el-form-item label="分类ID" prop="categoryId">
          <el-input v-model="form.categoryId" placeholder="请输入分类ID" />
        </el-form-item>
        <el-form-item label="编码" prop="spuCode">
          <el-input v-model="form.spuCode" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="副标题" prop="subtitle">
          <el-input v-model="form.subtitle" placeholder="请输入副标题" />
        </el-form-item>
        <el-form-item label="主图" prop="mainPic">
          <image-upload v-model="form.mainPic" :limit="1" />
        </el-form-item>
        <el-form-item label="轮播图" prop="subPics">
          <image-upload v-model="form.subPics" />
        </el-form-item>
        <el-form-item label="条形码" prop="barCode">
          <el-input v-model="form.barCode" placeholder="请输入条形码" />
        </el-form-item>
        <el-form-item label="品牌ID" prop="brandId">
          <el-input v-model="form.brandId" placeholder="请输入品牌ID" />
        </el-form-item>
        <!-- <el-form-item label="最低价" prop="minPrice">
          <el-input v-model="form.minPrice" placeholder="请输入最低价" />
        </el-form-item>
        <el-form-item label="综合评分" prop="overallScore">
          <el-input v-model="form.overallScore" placeholder="请输入综合评分" />
        </el-form-item> -->
        <el-form-item label="属性JSON" prop="attrJson">
          <el-input v-model="form.attrJson" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="规格JSON" prop="specJson">
          <el-input v-model="form.specJson" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="商品说明">
          <editor v-model="form.content" :min-height="192" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-radio-group v-model="form.state">
            <el-radio v-for="dict in ditalk_goods_state" :key="dict.value" :value="dict.value">{{ dict.label }}</el-radio>
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

<script setup name="InfoSnapshot" lang="ts">
import { listInfoSnapshot, getInfoSnapshot, delInfoSnapshot, addInfoSnapshot, updateInfoSnapshot } from '@/api/goods/infoSnapshot';
import { InfoSnapshotVO, InfoSnapshotQuery, InfoSnapshotForm } from '@/api/goods/infoSnapshot/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { ditalk_goods_state } = toRefs<any>(proxy?.useDict('ditalk_goods_state'));

const infoSnapshotList = ref<InfoSnapshotVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const dateRangeCreateTime = ref<[DateModelType, DateModelType]>(['', '']);

const queryFormRef = ref<ElFormInstance>();
const infoSnapshotFormRef = ref<ElFormInstance>();
// 单位转换
const minPrice = ref<number>(0); // 用于提交时转换为分

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: InfoSnapshotForm = {
  id: undefined,
  version: undefined,
  goodsId: undefined,
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
  overallScore: undefined,
  attrJson: undefined,
  specJson: undefined,
  state: undefined
};
const data = reactive<PageData<InfoSnapshotForm, InfoSnapshotQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    id: undefined,
    goodsId: undefined,
    shopId: undefined,
    categoryId: undefined,
    spuCode: undefined,
    name: undefined,
    subtitle: undefined,
    barCode: undefined,
    brandId: undefined,
    state: undefined,
    params: {
      createTime: undefined
    }
  },
  rules: {
    id: [{ required: true, message: 'ID不能为空', trigger: 'blur' }],
    goodsId: [{ required: true, message: '商品ID不能为空', trigger: 'blur' }],
    shopId: [{ required: true, message: '店铺ID不能为空', trigger: 'blur' }],
    categoryId: [{ required: true, message: '分类ID不能为空', trigger: 'blur' }],
    name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
    mainPic: [{ required: true, message: '主图ID不能为空', trigger: 'blur' }],
    minPrice: [{ required: true, message: '最低价不能为空', trigger: 'blur' }],
    overallScore: [{ required: true, message: '综合评分不能为空', trigger: 'blur' }],
    state: [{ required: true, message: '状态不能为空', trigger: 'change' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询商品信息快照列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.params = {};
  proxy?.addDateRange(queryParams.value, dateRangeCreateTime.value, 'CreateTime');
  const res = await listInfoSnapshot(queryParams.value);
  infoSnapshotList.value = res.rows;
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
  infoSnapshotFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: InfoSnapshotVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加商品信息快照';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: InfoSnapshotVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getInfoSnapshot(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改商品信息快照';
  // 处理单位转换
  minPrice.value = form.value.minPrice / 100;
};

/** 提交按钮 */
const submitForm = () => {
  // 单位转换
  form.value.minPrice = minPrice.value * 100;
  infoSnapshotFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateInfoSnapshot(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addInfoSnapshot(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: InfoSnapshotVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除商品信息快照编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delInfoSnapshot(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'goods/infoSnapshot/export',
    {
      ...queryParams.value
    },
    `infoSnapshot_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
