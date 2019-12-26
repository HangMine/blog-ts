import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink, from } from "apollo-link";
import { message } from "antd";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { SERVER } from "@/assets/js/http";

// 对请求进行处理
const Middleware = new ApolloLink((operation, forward: any) => {
  return forward(operation);
});
// 对响应数据进行处理
const Afterware = new ApolloLink((operation, forward: any) => {
  return forward(operation).map((response: any) => {
    const key: any = operation.operationName || Object.keys(response.data)[0];
    const result = response.data[key];
    if (result.msg) {
      result.code === "success"
        ? message.success(result.msg)
        : message.error(result.msg);
    }
    return response;
  });
});

// 对错误进行处理
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const httpLink = new HttpLink({
  uri: `${SERVER}/graphql` // 配置请求url
});

const client = new ApolloClient({
  link: from([Middleware, Afterware, errorLink, httpLink]),
  cache: new InMemoryCache()
});

const graph = (_gql: any) => {
  return client.query({
    query: _gql,
    fetchPolicy: "network-only" //始终重新发起请求，后续需要利用缓存
  });
};

graph.mutate = (_gql: any, params?: obj, option?: obj) => {
  return client.mutate({
    mutation: _gql,
    fetchPolicy: "no-cache", //始终重新发起请求，后续需要利用缓存
    ...option,
    variables: params
  });
};

// 自定义后的useQuery
const _useQuery = (gql: any) => {
  const { data } = useQuery(gql);
  return data;
};

// 自定义后的useMutation
const _useMutation = (gql: any) => {
  return useMutation(gql, {
    onCompleted(res) {
      const key = Object.keys(res)[0];
      const data = res[key];
      if (data.msg) {
        data.code === "success"
          ? message.success(data.msg)
          : message.error(data.msg);
      }
    }
  });
};

export { _useQuery as useQuery, _useMutation as useMutation };
export default graph;
