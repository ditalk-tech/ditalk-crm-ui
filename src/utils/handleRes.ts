/**
 * 处理响应结果工具类
 */
import { ElMessage } from 'element-plus';

export const showMsg = (res: any) => {
  if (res.code == 200) {
    ElMessage.success(res.msg);
    return true;
  } else {
    ElMessage.error(res.msg);
    return false;
  }
}