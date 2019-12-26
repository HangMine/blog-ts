// import React, { FC, useState, useEffect } from "react";
// import "./index.scss";
// import { Icon, Button, Input, Menu, Dropdown } from "antd";

// import Collapse from "@/components/base/Collapse";

// import gql from "graphql-tag";

// import { useQuery, useMutation } from "@/assets/js/graph";

// const GET_ARTICLETYPES = gql`
//   {
//     articleTypes {
//       id
//       name
//       icon
//     }
//   }
// `;
// const ADD_TYPE = gql`
//   mutation operateArticleType($articleType: articleTypeInput) {
//     operateArticleType(articleType: $articleType) {
//       code
//       msg
//       addArticleType {
//         id
//         name
//         icon
//       }
//     }
//   }
// `;

// type AddType = {
//   onChange: (activeTypeId: number) => void;
// };

// const AddType: FC<AddType> = ({ onChange }) => {
//   const types: articleType[] = useQuery(GET_ARTICLETYPES).articleTypes || [];

//   const [addTypeMutate] = useMutation(ADD_TYPE);

//   const [addTypeName, setaddTypeName] = useState("");

//   const handleAddType = () => {
//     addTypeMutate({
//       variables: {
//         articleType: { name: addTypeName }
//       },
//       refetchQueries: [
//         {
//           query: GET_ARTICLETYPES
//         }
//       ]
//     });
//   };

//   const [activeTypeId, setactiveTypeId] = useState();

//   const handleTypeClick = (activeTypeId: number) => {
//     setactiveTypeId(activeTypeId);
//     onChange && onChange(activeTypeId);
//   };

//   const typeList = types.map((menu, id) => (
//     <li
//       key={id}
//       className={`${activeTypeId === menu.id ? "active" : ""}`}
//       onClick={() => handleTypeClick(menu.id)}
//     >
//       {menu.name}
//       <div className="icon-wrap">
//         <Dropdown
//           overlay={
//             <Menu>
//               <Menu.Item>
//                 <Icon type="form" />
//                 修改文章类型
//               </Menu.Item>
//               <Menu.Item>
//                 <Icon type="delete" />
//                 删除文章类型
//               </Menu.Item>
//             </Menu>
//           }
//         >
//           <Icon type="setting" className="setting-icon" theme="filled" />
//         </Dropdown>
//       </div>
//     </li>
//   ));

//   return (
//     <div className="add-article-type">
//       <Collapse
//         header={
//           <h4>
//             <Icon type="plus" />
//             <span>新建类型</span>
//           </h4>
//         }
//       >
//         {/* 取消需要调用collapse里面的setIsCollapse函数,通过setIsCollapse来改变isCollapse */}
//         {(setIsCollapse: any) => (
//           <div className="maside-collapse">
//             <Input
//               className="rm-antd-border"
//               value={addTypeName}
//               allowClear
//               onChange={e => setaddTypeName(e.target.value)}
//             />
//             <div className="btn-group">
//               <Button
//                 className="btn-commit"
//                 ghost
//                 shape="round"
//                 onClick={handleAddType}
//               >
//                 提交
//               </Button>
//               <Button
//                 className="btn-cancel"
//                 ghost
//                 shape="round"
//                 onClick={() => setIsCollapse(false)}
//               >
//                 取消
//               </Button>
//             </div>
//           </div>
//         )}
//       </Collapse>

//       <ul>{typeList}</ul>
//     </div>
//   );
// };

// export default AddType;
