import { Form, Input, Select, Switch, Tabs, Upload, message } from 'antd';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import React from 'react';
import { useForm } from 'antd/lib/form/Form';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { USER_SERVICE, submitFormUser } from '../../services/userService';
import { RESPONSE_API } from '../../services/common';
import { AUTH_SERVICE } from '../../services/authService';

export const ChangePassword = (props) => {
    const [form] = useForm();
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (data) {
            let formValue = {
                password: data.password,
                retypeNewPassword: data.retypeNewPassword
            }
            form.setFieldsValue(formValue)
        }
    }, [data]);

    const validateMessages = {
        required: '${label} không được để trống!',
        types: {
            password: '${label} is not a valid password!',
        },
        number: {
            range: '${label} trong khoảng ${min} - ${max}',
        },
    };

    const submitForm = async (e) => {
        if (checkPassword(e.password, e.retypeNewPassword)) {
            const response = await AUTH_SERVICE.update({ password: e.password });
            if (response?.status == 'success') {
                message.success('Change password successfully!');
            } else {
                message.error(response.message || 'error');
            }
        } else {
            setError(true);
            message.error('Password does not match!');
        }

    };

    const checkPassword = (newPass, retypePass) => {
        return newPass === retypePass;
    }

    const resetForm = () => {
        form.resetFields();
    };

    const onFieldsChange = (e) => {
        if (e.length > 0) {
            let value = typeof e[0].value == 'string' ? e[0].value : e[0].value;

            let fieldValue = {
                [String(e[0].name[0])]: value
            }
            form.setFieldsValue(fieldValue);
        }
    };

    return (
        <>
            <Form
                className='p-3'
                name='nest-messages form'
                form={form}
                onFinish={submitForm}
                onFieldsChange={onFieldsChange}
                validateMessages={validateMessages}
            >
                <div className='mb-3'>

                    <Form.Item name="password" label="Mật khảu mới"
                        className='d-block' rules={[{ required: true }]}>
                        <Input type='password' className='form-control' placeholder='Nhập mật khẩu mới' />
                    </Form.Item>

                    <Form.Item name="retypeNewPassword" label="Nhập lại mật khẩu"
                        className="d-block" rules={[{ required: true }]}>
                        <Input type='password' className={`form-control ${error == true ? "borderError" : ""}`} placeholder='Nhập lại mật khẩu' onChange={() => setError(false)}/>
                    </Form.Item>

                </div>

                <div className='d-flex justify-content-center'>
                    <button type="submit" className="btn btn-primary text-center" style={{ marginRight: 10, padding: '10px 10px' }}>
                        Save
                    </button>

                    <button type="button" className="btn btn-secondary text-center" style={{ marginLeft: 10, padding: '10px 10px' }} onClick={resetForm}>
                        Reset
                    </button>
                </div>
            </Form>
        </>
    )
}