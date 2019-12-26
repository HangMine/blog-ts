import React, { FC, useEffect, useMemo } from "react";
import { Button, Modal } from "antd";
import { useMappedState, useDispatch } from "redux-react-hook";
// import { fetchTable } from "@/redux/actions";
import http from "@/assets/js/http";
import HFilter from "@/components/HFilter/HFilter";
import { timeFormat, handleUpload } from "@/assets/js/common";
import { useCurrent } from "../use/useCurrent";
type HMdeolProp = {
  filters: filters;
  url?: string;
  params?: obj;
  commitUrl: string;
  commitParams?: obj;
  httpType?: string;
  data: {
    show: boolean;
    loading: boolean;
    isEdit: boolean;
    row: obj;
  };
  setData: (any: any) => void;
  handleValues?: (values: obj) => any;
  rowKey?: string;
  title?: string;
  commitCallback?: (data: obj) => void;
};

const HModel: FC<HMdeolProp> = ({
  filters,
  url,
  params,
  commitUrl,
  commitParams,
  httpType,
  data,
  setData,
  handleValues,
  rowKey,
  title,
  commitCallback
}) => {
  const dispatch = useDispatch();
  const filterParams = useMappedState(state => state.filterParams);
  const [form, setform]: [any, any] = useCurrent({});
  const {
    getFieldDecorator,
    validateFields,
    resetFields,
    validateFieldsAndScroll
  } = form;

  const hasImmediate = useMemo(() => {
    return filters.some(filter => !!(filter.react && filter.react.immediate));
  }, [filters]);

  useEffect(() => {
    data.show && data.isEdit && handleImmdiateCallback(data.row);
  }, []);

  // 监听打开时(加上editForm的监听是因为弹窗显示后editForm还没有设置好值)
  useEffect(() => {
    if (!Object.keys(form).length) return;
    if (data.isEdit) {
      setValues(data.row);
    } else {
      reset();
    }
    data.isEdit ? setValues(data.row) : reset();
  }, [data, form]);

  // 重置
  const reset = () => {
    if (!Object.keys(form).length || !filters) return;
    resetFields();
  };

  // 处理需要马上执行的函数
  const handleImmdiateCallback = (row: obj) => {
    for (const filter of filters) {
      if (filter.react && filter.react.callback && filter.react.immediate) {
        const value = (row.info && row.info[filter.key]) || row[filter.key];
        filter.react.callback(value, form);
      }
    }
  };

  // 设置值
  const setValues = (row: obj) => {
    if (!Object.keys(form).length || !filters) return;
    const { setFieldsValue } = form;
    // 保留表单上的字段
    let resValues: obj = {};

    for (const filter of filters) {
      const key = filter.key;
      const value = row[filter.key];
      switch (filter.type) {
        // 处理上传类型的参数
        case "upload":
          const uploadItem = value || [];
          resValues[key] = uploadItem.map((_item: any, i: number) => {
            return {
              uid: i,
              name: (_item && _item.split("/").slice(-1)[0]) || "",
              status: "done",
              url: _item
            };
          });
          break;
        case "select":
          resValues[key] = value || undefined;
          break;
        default:
          resValues[key] = value;
          break;
      }
    }
    // 必须使用settimeout，否则会出现报错（虽然好像不影响使用）
    setTimeout(() => {
      setFieldsValue(resValues);
    }, 0);
  };

  // 获取参数
  const getFormParams = (filters: filters, obj: obj) => {
    timeFormat(filters, obj);
    handleUpload(filters, obj);
    if (handleValues) obj = handleValues(obj);
    return obj;
  };

  // 提交
  const _commit = () => {
    if (!commitUrl) {
      return;
    }
    validateFields((err: any, values: any) => {
      if (err) {
        validateFieldsAndScroll();
        return;
      }

      setData({
        ...data,
        loading: true
      });

      const _rowKey = rowKey || "id";
      const _params = {
        [_rowKey]: data.isEdit ? data.row[_rowKey] : undefined,
        ...getFormParams(filters || [], values),
        ...commitParams
      };
      const _http = httpType === "post" ? http.post : http;

      _http(commitUrl, _params).then(res => {
        setData({
          ...data,
          loading: false
        });
        if (res.code == "success") {
          setData({
            ...data,
            show: false
          });
          // url && dispatch(fetchTable(url, { ...params, ...filterParams }));
          commitCallback && commitCallback(data);
        }
      });
    });
  };

  return (
    <Modal
      title={title || (data.isEdit ? "编辑" : "新增")}
      destroyOnClose={hasImmediate}
      visible={data.show}
      onOk={_commit}
      onCancel={() =>
        setData({
          ...data,
          show: false
        })
      }
      footer={[
        <Button
          key="cancel"
          onClick={() =>
            setData({
              ...data,
              show: false
            })
          }
        >
          取消
        </Button>,
        <Button
          key="commit"
          type="primary"
          loading={data.loading}
          onClick={_commit}
        >
          确定
        </Button>
      ]}
    >
      <HFilter data={filters} onForm={(form: any) => setform(form)}></HFilter>
    </Modal>
  );
};

export default HModel;
