import React from 'react';
import { Button, Popconfirm, Table, Form, Input, Select, Space } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { DeleteOutlined } from '@ant-design/icons';
import { getUsers, deleteUser, addUser } from '../../actions/users';

function OrganizationUsers() {
  const [form] = Form.useForm();

  const dispatch = useDispatch();

  const { organization, users, loading } = useSelector((state) => {
    return {
      organization: state.organizations.details[state.organizations.selected],
      users: state.users.ids.map((id) => state.users.details[id]),
      loading: state.users.loading,
    };
  });

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    dispatch(getUsers());
  };

  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (text, record) => record.first_name + ' ' + record.last_name,
    },
    {
      title: 'Email',
      key: 'email',
      dataIndex: 'email',
    },
    {
      title: 'Role',
      key: 'role',
      dataIndex: ['permission', 'role'],
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Popconfirm
          title="Sure to delete?"
          onConfirm={() => dispatch(deleteUser(record.id)).then(fetchUsers())}
        >
          <Button icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <Space direction="vertical">
      {organization.permission.role === 'owner' ? (
        <Form
          form={form}
          name="add_user"
          layout="inline"
          initialValues={{
            role: 'member',
          }}
          onFinish={(values) =>
            dispatch(addUser(values)).then(() => {
              fetchUsers();
              form.resetFields();
            })
          }
        >
          <Form.Item
            name="email"
            placeholder="email"
            rules={[
              { required: true, message: 'Please input your title!' },
              { type: 'email', message: 'Please input valid Email!' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="role">
            <Select placeholder="role">
              <Select.Option value="owner">Owner</Select.Option>
              <Select.Option value="member">Member</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button form="add_user" type="primary" htmlType="submit" block>
              Add User
            </Button>
          </Form.Item>
        </Form>
      ) : null}
      <Table
        rowKey={'id'}
        loading={loading}
        pagination={false}
        columns={columns}
        dataSource={users}
      />
    </Space>
  );
}

export default OrganizationUsers;