<template>
  <div class="component-upload-image">
    <el-upload
      ref="imageUploadRef"
      :action="uploadImgUrl"
      list-type="picture-card"
      :on-success="handleUploadSuccess"
      :before-upload="handleBeforeUpload"
      :limit="1"
      :accept="fileAccept"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      :show-file-list="true"
      :headers="headers"
      :file-list="fileList"
      :class="{ hide: isHide }"
    >
      <el-icon class="avatar-uploader-icon" :size="20">
        <plus />
      </el-icon>
      <template #file="{ file }">
        <div>
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-delete" @click="handleDelete(file)">
              <el-icon><Delete /></el-icon>
            </span>
          </span>
        </div>
      </template>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import { listByIds, delOss } from '@/api/system/oss';
import { OssVO } from '@/api/system/oss/types';
import { propTypes } from '@/utils/propTypes';
import { globalHeaders } from '@/utils/request';
import { compressAccurately } from 'image-conversion';

const props = defineProps({
  modelValue: {
    type: [Number, String, Object, Array],
    default: () => []
  },
  // 大小限制(MB)
  fileSize: propTypes.number.def(1),
  // 文件类型, 例如['png', 'jpg', 'jpeg']
  fileType: propTypes.array.def(['png', 'jpg', 'jpeg']),
  // 是否显示提示
  isShowTip: {
    type: Boolean,
    default: true
  },
  // 是否支持压缩，默认否
  compressSupport: {
    type: Boolean,
    default: true
  },
  // 压缩目标大小，单位KB。默认300KB以上文件才压缩，并压缩至300KB以内
  compressTargetSize: propTypes.number.def(300)
});

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const emit = defineEmits(['update:modelValue']);
const number = ref(0);
const uploadList = ref<any[]>([]);

const baseUrl = import.meta.env.VITE_APP_BASE_API;
const uploadImgUrl = ref(baseUrl + '/resource/oss/upload'); // 上传的图片服务器地址
const headers = ref(globalHeaders());

const fileList = ref<any[]>([]);
const imageUploadRef = ref<ElUploadInstance>();

// 监听 fileType 变化，更新 fileAccept
const fileAccept = computed(() => props.fileType.map((type) => `.${type}`).join(','));

const isHide = ref<boolean>(false); // 隐藏 avatar-uploader-icon 标记

watch(
  () => props.modelValue,
  async (val: string) => {
    if (val) {
      // 首先将值转为数组
      let list: OssVO[] = [];
      if (Array.isArray(val)) {
        list = val as OssVO[];
      } else {
        const res = await listByIds(val);
        list = res.data;
      }
      // 然后将数组转为对象数组
      fileList.value = list.map((item) => {
        // 字符串回显处理 如果此处存的是url可直接回显 如果存的是id需要调用接口查出来
        let itemData;
        if (typeof item === 'string') {
          itemData = { name: item, url: item };
        } else {
          // 此处name使用ossId 防止删除出现重名
          itemData = { name: item.ossId, url: item.url, ossId: item.ossId };
        }
        return itemData;
      });
    } else {
      fileList.value = [];
      return [];
    }
    isHide.value = fileList.value.length >= 1;
  },
  { deep: true, immediate: true }
);

/** 上传前loading加载 */
const handleBeforeUpload = (file: any) => {
  isHide.value = true;
  let isImg = false;
  if (props.fileType.length) {
    let fileExtension = '';
    if (file.name.lastIndexOf('.') > -1) {
      fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1);
    }
    isImg = props.fileType.some((type: any) => {
      if (file.type.indexOf(type) > -1) return true;
      if (fileExtension && fileExtension.indexOf(type) > -1) return true;
      return false;
    });
  } else {
    isImg = file.type.indexOf('image') > -1;
  }
  if (!isImg) {
    proxy?.$modal.msgError(`文件格式不正确, 请上传${props.fileType.join('/')}图片格式文件!`);
    return false;
  }
  if (file.name.includes(',')) {
    proxy?.$modal.msgError('文件名不正确，不能包含英文逗号!');
    return false;
  }
  if (props.fileSize) {
    const isLt = file.size / 1024 / 1024 < props.fileSize;
    if (!isLt) {
      proxy?.$modal.msgError(`上传头像图片大小不能超过 ${props.fileSize} MB!`);
      return false;
    }
  }

  //压缩图片，开启压缩并且大于指定的压缩大小时才压缩
  if (props.compressSupport && file.size / 1024 > props.compressTargetSize) {
    proxy?.$modal.loading('正在上传图片，请稍候...');
    number.value++;
    return compressAccurately(file, props.compressTargetSize);
  } else {
    proxy?.$modal.loading('正在上传图片，请稍候...');
    number.value++;
  }
};

// 文件个数超出
const handleExceed = () => {
  proxy?.$modal.msgError(`上传文件数量不能超过 1 个!`);
};

// 上传成功回调
const handleUploadSuccess = (res: any, file: UploadFile) => {
  if (res.code === 200) {
    uploadList.value.push({ name: res.data.fileName, url: res.data.url, ossId: res.data.ossId });
    uploadedSuccessfully();
  } else {
    number.value--;
    proxy?.$modal.closeLoading();
    proxy?.$modal.msgError(res.msg);
    imageUploadRef.value?.handleRemove(file);
    uploadedSuccessfully();
  }
};

// 删除图片
const handleDelete = (file: UploadFile): boolean => {
  isHide.value = false;
  const findex = fileList.value.map((f) => f.name).indexOf(file.name);
  if (findex > -1 && uploadList.value.length === number.value) {
    const ossId = fileList.value[findex].ossId;
    delOss(ossId);
    fileList.value.splice(findex, 1);
    emit('update:modelValue', listToString(fileList.value));
    return false;
  }
  return true;
};

// 上传结束处理
const uploadedSuccessfully = () => {
  if (number.value > 0 && uploadList.value.length === number.value) {
    fileList.value = fileList.value.filter((f) => f.url !== undefined).concat(uploadList.value);
    uploadList.value = [];
    number.value = 0;
    emit('update:modelValue', listToString(fileList.value));
    proxy?.$modal.closeLoading();
  }
};

// 上传失败
const handleUploadError = () => {
  proxy?.$modal.msgError('上传图片失败');
  proxy?.$modal.closeLoading();
};

// 对象转成指定字符串分隔
const listToString = (list: any[], separator?: string) => {
  let strs = '';
  separator = separator || ',';
  for (const i in list) {
    if (undefined !== list[i].ossId && list[i].url.indexOf('blob:') !== 0) {
      strs += list[i].ossId + separator;
    }
  }
  return strs != '' ? strs.substring(0, strs.length - 1) : '';
};
</script>

<style lang="scss" scoped>
// .el-upload--picture-card 控制加号部分
:deep(.hide .el-upload--picture-card) {
  display: none;
}

.component-upload-image {
  :deep .el-upload--picture-card {
    width: 50px;
    height: 50px;
  }

  :deep .el-upload-list--picture-card .el-upload-list__item {
    width: 50px;
    height: 50px;
  }
}

// 20250715 weidixian 解决：上传时图片是出现闪烁、抖动的情况
:deep .el-list-enter-active,
:deep .el-list-leave-active {
  transition: none;
}
:deep .el-list-enter,
:deep .el-list-leave-active {
  opacity: 0;
}
//////////////////////////////////////////////////////
</style>
