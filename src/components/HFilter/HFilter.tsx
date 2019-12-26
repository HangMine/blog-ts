import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useMappedState } from "redux-react-hook";
import {
  Input,
  Form,
  Button,
  Select,
  Radio,
  DatePicker,
  Upload,
  Icon,
  message,
  AutoComplete,
  Row,
  Col
} from "antd";
import { FormComponentProps } from "antd/es/form";
import "./HFilter.scss";
import http, { params2query, getUrl } from "@/assets/js/http";
import moment from "moment";
import { timeFormat } from "@/assets/js/common";
import axios from "axios";
import { isNumber, numClear } from "@/assets/js/check";
const { TextArea } = Input;
const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

// 根据类型返回单个表单
const getFormItem = (
  item: filterItem,
  c_data: filters,
  setc_data: any,
  form: any,
  isMobile: boolean
) => {
  item = handleProp(item, form);
  switch (item.type) {
    case "input":
    default:
      return (
        <Input
          placeholder={getPlaceholder(item)}
          allowClear
          {...item.props}
          onChange={e =>
            onChange(e.target.value, item, c_data, setc_data, form)
          }
        ></Input>
      );
    case "textarea":
      return (
        <TextArea rows={4} placeholder={getPlaceholder(item)} {...item.props} />
      );
    case "select":
      return (
        <Select
          placeholder={getPlaceholder(item)}
          showSearch
          allowClear
          style={{
            width: (item.cols && item.cols != 1) || isMobile ? "100%" : 170
          }}
          {...item.props}
          onChange={value => onChange(value, item, c_data, setc_data, form)}
          filterOption={(input, option: any) =>
            option.props.children.includes(input)
          }
        >
          {item.options &&
            item.options.map(option => (
              <Option
                key={getOption(option, "key")}
                value={getOption(option, "key")}
                title={getOption(option, "title")}
                {...option.props}
              >
                {getOption(option, "title")}
              </Option>
            ))}
        </Select>
      );
    case "radio":
      return (
        <Radio.Group
          onChange={value => onChange(value, item, c_data, setc_data, form)}
          {...item.props}
        >
          {item.options &&
            item.options.map(option => (
              <Radio
                key={getOption(option, "key")}
                value={getOption(option, "key")}
                {...option.props}
              >
                {getOption(option, "title")}
              </Radio>
            ))}
        </Radio.Group>
      );
    case "date":
      return (
        <DatePicker
          placeholder={getPlaceholder(item, "请选择日期")}
          allowClear
          {...item.props}
        />
      );
    case "range":
      return <RangePicker style={{ width: 370 }} allowClear {...item.props} />;
    case "week":
      return (
        <WeekPicker
          placeholder={getPlaceholder(item, "请选择星期")}
          allowClear
          {...item.props}
        />
      );
    case "month":
      return (
        <MonthPicker
          placeholder={getPlaceholder(item, "请选择月份")}
          allowClear
          {...item.props}
        />
      );
    case "upload":
      const props = {
        name: "file",
        action: getUrl(item.uploadUrl || ""),
        multiple: true,
        headers: {
          authorization: "authorization-text"
        },
        onChange(info: any) {
          if (info.file.status !== "uploading") {
          }
          if (info.file.status === "done") {
            message.success(`${info.file.name} ${info.file.response.msg}`);
          } else if (info.file.status === "error") {
            message.error(`${info.file.name} 上传失败:${info.file.error.msg}`);
          }
        },
        // 自定义上传状态
        customRequest({ action, file, onError, onProgress, onSuccess }: any) {
          let formData = new FormData();
          formData.append("file", file);

          axios
            .post(action, formData, {
              onUploadProgress: ({ total, loaded }) => {
                onProgress(
                  { percent: +Math.round((loaded / total) * 100).toFixed(2) },
                  file
                );
              }
            })
            .then(({ data: res }) => {
              if (res.code == "0") {
                onSuccess(res, file);
              } else {
                onError(res, file);
              }
            })
            .catch(onError);

          return {
            abort() {
              console.log("已中断上传请求");
            }
          };
        }
      };
      return (
        <Upload {...props} {...item.props}>
          <Button>
            <Icon type="upload" /> 点击上传
          </Button>
        </Upload>
      );
    case "auto":
      const options = item.options || [];
      const dataSource = options.map(opt => (
        <Option
          key={opt.key || opt.id}
          value={opt.key || opt.id}
          {...opt.props}
        >
          {opt.title || opt.name}
        </Option>
      ));
      return (
        <AutoComplete
          dataSource={dataSource}
          placeholder={getPlaceholder(item)}
          optionLabelProp="value"
          {...item.props}
          onChange={value => onChange(value, item, c_data, setc_data, form)}
        >
          <Input allowClear {...item.props}></Input>
        </AutoComplete>
      );
  }
};
// 监听下拉框值
const onChange = (
  value: any,
  item: filterItem,
  c_data: filters,
  setc_data: any,
  form: any
) => {
  item.react &&
    item.react.url &&
    http(item.react.url, { [item.react.paramsKey || "id"]: value }).then(
      res => {
        const itemIndex = c_data.findIndex(
          _item => _item.key === (item.react && item.react.key)
        );
        c_data[itemIndex].options = res.data || [];
        // set进去的必须是一个新的对象
        setc_data([...c_data]);
      }
    );
  // callback在最下面的onValuesChange执行
  item.react && item.react.callback && item.react.callback(value, form);
};
// 获取placeholder
const getPlaceholder = (item: filterItem, defaultValue?: string) => {
  const tipKey = item.type === "select" ? "选择" : "输入";
  const placeholder =
    item.placeholder || defaultValue || `请${tipKey}${item.title}`;
  return placeholder;
};
// 兼容获取option值
const getOption = (option: obj, type: "key" | "title") => {
  if (type === "key") {
    return option.key || option.id;
  } else {
    return option.title || option.name;
  }
};

// props处理
const handleProp = (filter: filterItem, form: any) => {
  switch (filter.normalize) {
    case "dotNumber":
      filter.props = {
        ...filter.props,
        onBlur: (e: any) =>
          form.setFieldsValue({ [filter.key]: (+e.target.value).toFixed(2) }),
        style: { width: 170 }
      };
      break;
    case "dotNumberPercent":
      filter.props = {
        ...filter.props,
        addonAfter: "%",
        onBlur: (e: any) =>
          form.setFieldsValue({ [filter.key]: (+e.target.value).toFixed(2) }),
        style: { width: 170 }
      };
      break;
    case "number":
      filter.props = {
        ...filter.props,
        style: { width: 170 }
      };
      break;
    case "numberPercent":
      filter.props = {
        ...filter.props,
        addonAfter: "%",
        style: { width: 170 }
      };
      break;

    default:
      break;
  }
  return filter;
};

type HFilter = {
  url?: string;
  out?: boolean;
  params?: obj;
  data: filters;
  cols?: 1 | 2 | 3 | 4 | 6 | 8;
  // 是否是筛选框
  isFilt?: boolean;
  onForm?: (arg: any) => void;
  onSearch?: (filterParams: obj) => void;
  [any: string]: any;
};

// 主函数
const HFilter: React.FC<HFilter & FormComponentProps> = ({
  children,
  form,
  url,
  out,
  params,
  data,
  cols,
  isFilt,
  onForm,
  onSearch,
  ...otherProps
}) => {
  const isMobile = useMappedState(state => state.isMobile);
  const isCols = useMemo(() => !isFilt && cols, [isFilt, cols]);
  const { getFieldDecorator, resetFields, getFieldsValue } = form;
  // 首次加载后将form传递出去
  useEffect(() => {
    onForm && onForm(form);
  }, []);

  const [c_data, setc_data]: [filters, any] = useState([]);
  // 以列数分隔的数据
  const [cols_data, setcols_data]: [filters[], any] = useState([[]]);
  useEffect(() => {
    setc_data(data);
    isCols && setcols_data(data2cols_data(data));
  }, [data]);

  // 根据列数处理数据
  const data2cols_data = (data: filters) => {
    let cols_data = [...data];
    let resArr: any[][] = []; //最终数组
    let itemArr: any[] = []; // 存放二堆单个数组

    const pushItemArr = () => {
      // 到达节点时重置
      resArr.push(itemArr);
      itemArr = [];
    };

    for (const [i, item] of Object.entries(cols_data)) {
      item.cols = item.cols || cols || 1;
      const span = 1 / item.cols;
      const itemArrSpan = itemArr.map(item => 1 / item.cols);
      const itemArrSpanSum = itemArrSpan.length
        ? itemArrSpan.reduce((total, value) => total + value)
        : 0;

      // 超过一行
      if (itemArrSpanSum + span > 1) {
        pushItemArr();
      }

      itemArr.push(item);

      // 最后一个
      if (+i === cols_data.length - 1) {
        if (itemArr.length > 1) {
          // 未超过一行
          itemArr = itemArr.map(item => ({ ...item, cols: itemArr.length }));
        } else {
          // 超过一行
          item.cols = 1;
        }
        pushItemArr();
      }
    }
    return resArr;
  };
  // 搜索
  const currentSearch = () => {
    const values = getFieldsValue();
    timeFormat(c_data || [], values);
    if (isFilt) clearUndefined(values);
    onSearch && onSearch({ ...params, ...values });
  };

  // 清除undefined值
  const clearUndefined = (params: obj) => {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined) delete params[key];
    }
  };

  // 获取默认初始值
  const getInitValue = (item: filterItem) => {
    switch (item.type) {
      case "select":
        return item.initValue || undefined;
      case "date":
        return item.initValue ? moment(item.initValue) : moment(new Date());
      case "upload":
        return item.initValue || [];
      default:
        return item.initValue || "";
    }
  };

  // 根据不同类型设置值
  const normalize = (item: filterItem, value: any) => {
    switch (item.normalize) {
      case "dotNumber":
      case "dotNumberPercent":
      case "number":
      case "numberPercent":
        // 保存两位小数
        const valueType = typeof value;
        if (["number", "string"].includes(valueType)) {
          value = numClear(value);
        } else {
          value = "";
        }
        // if (value) value = numClear(value);
        break;
      default:
        break;
    }
    switch (item.type) {
      case "date":
        return (value && moment(value)) || null;
      case "range":
        const _value = Array.isArray(value) ? value : [];
        return moment(_value);
      default:
        return value;
    }
  };

  // 获取不同类型的value名称
  const getValuePropName = (item: filterItem) => {
    switch (item.type) {
      case "upload":
        return "fileList";
      default:
        return "value";
    }
  };
  // 重置
  const reset = () => {
    resetFields();
  };
  // 导出
  const _export = () => {
    const values = getFieldsValue();
    const exportUrl = params2query(
      getUrl(url!),
      { action: "export", ...params, ...values },
      true
    );
    window.open(exportUrl);
  };

  // 设置上传框的值时修改结构
  const getValueFromEvent = (e: any) => {
    let fileList = e.fileList;
    const isAllDone = fileList.every((file: any) =>
      ["done", "error"].includes(file.status)
    );
    if (isAllDone) {
      fileList = fileList
        .filter((file: any) => {
          // 只保留成功的文件
          return file.status === "done";
        })
        .map((file: any) => {
          return {
            uid: file.uid,
            name: file.name,
            url: file.url || (file.response && file.response.data) || "",
            status: file.status
          };
        });
    }
    return fileList;
  };

  const FormItem = (item: filterItem) => (
    <Form.Item key={item.key} label={item.title}>
      {getFieldDecorator(item.key, {
        rules: item.rules || [],
        // 设置初始值
        initialValue: getInitValue(item),
        // 不同输入框value的名称
        valuePropName: getValuePropName(item),
        // 根据值设置值
        normalize: (value: any) => {
          return normalize(item, value);
        },
        // 根据事件返回值
        getValueFromEvent:
          item.type === "upload" ? getValueFromEvent : undefined
      })(
        (typeof item.tsx === "function" ? item.tsx(form) : item.tsx) ||
          getFormItem(item, c_data, setc_data, form, isMobile)
      )}
    </Form.Item>
  );

  const search = () =>
    isFilt && (
      <Form.Item>
        <Button className="filt-btn" type="primary" onClick={currentSearch}>
          搜索
        </Button>
        <Button className="filt-btn reset-btn" onClick={reset}>
          重置
        </Button>
        {out && (
          <Button className="filt-btn" type="dashed" onClick={_export}>
            导出
          </Button>
        )}
      </Form.Item>
    );

  if (isCols) {
    // 分列
    return (
      <Form className="h-filter" {...otherProps}>
        {cols_data.map((rowCols, i) => (
          <Row key={i} gutter={20}>
            {rowCols.map(item => (
              <Col key={item.key} span={24 / (item.cols || cols || 2)}>
                {FormItem(item)}
              </Col>
            ))}
          </Row>
        ))}
        {children}
        {search()}
      </Form>
    );
  } else {
    // 普通
    const layout = !isMobile && isFilt ? "inline" : undefined;
    return (
      <Form className="h-filter" layout={layout} {...otherProps}>
        {c_data.map(item => FormItem(item))}
        {children}
        {search()}
      </Form>
    );
  }
};

export default Form.create<HFilter & FormComponentProps>()(HFilter);
