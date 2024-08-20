// @ts-nocheck
import { Form, Input, Select, Switch, Tabs, Upload, message } from 'antd';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import React from 'react';
import { useForm } from 'antd/lib/form/Form';
import { PlusOutlined } from '@ant-design/icons';
import { AUTH_SERVICE } from '../../services/authService';
import uploadApi from '../../services/upload';
import { buildImage, setItem } from '../../services/common';

export const ProfileSetting = (props) => {
    const [form] = useForm();
    const [files, setFiles] = useState([]);
    const [data, setData] = useState(null);

    useEffect(async () => {
        form.setFieldsValue({
            name: props.profileData.name,
            // username: props.profileData.username,
            email: props.profileData.email,
            address: props.profileData.address,
            gender: props.profileData.gender,
            phone: props.profileData.phone,
            birthDay: props.profileData.birthDay,
            avatar: props.profileData.avatar
        });
        setData(props.profileData);
    },[]);

    useEffect(() => {
        if (data) {
            let file = [];
            file.push({
                uid: file.length,
                name: props.profileData.avatar,
                status: 'done',
                url: buildImage(props.profileData.avatar),
                default: true
            });
            let formValue = {
                name: data.name,
                // username: data.username,
                email: data.email,
                address: data.address,
                gender: data.gender,
                phone: data.phone,
                birthDay: data.birthDay,
                image: file || null
            };
            setFiles(file);
            form.setFieldsValue(formValue);
        }
    }, [data]);

    const validateMessages = {
        required: '${label} không được để trống!',
        types: {
            email: '${label} không đúng định dạng email',
            number: '${label} không đúng định dạng số',
        },
        number: {
            range: '${label} trong khoảng ${min} - ${max}',
        },
    };

    const submitForm = async (e) => {
        let avatar = null;

        if (!files[0].default) {
            avatar = await uploadApi.uploadFile(files);
        }

        let formData = { ...e };
        delete formData.image;
		if(avatar) {
			formData.avatar = avatar;
		}
        const response = await AUTH_SERVICE.update(formData);
        if (response?.status == 'success') {
            message.success('Update profile successfully!');
			if(avatar) {
				setItem('avatar', avatar);
				
			}
			setItem('name', formData.name);
			setItem('phone', formData.phone);
			props.getProfile();
        } else {
            message.error(response?.message || 'error');
        }
    }

    const resetForm = () => {
        form.resetFields();
    }

    const onFieldsChange = (e) => {
        if (e.length > 0) {
            let value = typeof e[0].value == 'string' ? e[0].value : e[0].value;

            let fieldValue = {
                [String(e[0].name[0])]: value
            }
            form.setFieldsValue(fieldValue);
        }
    }

    const normFile = (e) => {
        if (e?.fileList) {
            setFiles( e?.fileList);
        }
        return e?.fileList;
    }

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

                    <div className='row'>

                        <div className='col-md-9'>

                            <div className='row'>

                                <div className='col-md-6'>
                                    <Form.Item name="name" label="Họ và tên"
                                        rules={[{ required: true }]}
                                        className=' d-block'
                                    >
                                        <Input className='form-control' placeholder='Nhập tên' />
                                    </Form.Item>
                                </div>

                                {/* <div className='col-md-6'>
                                    <Form.Item name="username" label="User name"
                                        className=' d-block' rules={[{ required: true }]}>
                                        <Input className='form-control' placeholder='Enter username' />
                                    </Form.Item>
                                </div> */}

                            </div>

                            <div className='row'>

                                <div className='col-md-6'>
                                    <Form.Item name="email" label="Email"
                                        rules={[{ required: true }]}
                                        className='d-block'>
                                        <Input className='form-control' placeholder='Nhập email' disabled/>
                                    </Form.Item>
                                </div>

                                <div className='col-md-3'>
                                    <Form.Item className='d-block' name="gender" label="Giới tính">
                                        <Select
                                            placeholder="Chọn giới tính"
                                            style={{ width: '100%' }}
                                            options={[
                                                {
                                                    value: 'male',
                                                    label: 'Nam'
                                                },
                                                {
                                                    value: 'female',
                                                    label: 'Nữ'
                                                },
                                                {
                                                    value: 'other',
                                                    label: 'Khác'
                                                }
                                            ]}
                                        />
                                    </Form.Item>
                                </div>

                                <div className='col-md-3'>
                                    <Form.Item name="birthDay" label="Ngày sinh"
                                        className='d-block'>
                                        <Input type='date' className='form-control' />
                                    </Form.Item>
                                </div>

                            </div>

                        </div>

                        <div className='col-md-3'>

                            <Form.Item
                                label="Avatar"
                                name="image"
                                accept="images/**"
                                className='d-block'
                                valuePropName="fileList"
                                filelist={files}
                                getValueFromEvent={normFile}
                            >
                                <Upload action="/upload" listType="picture-card">
                                    {files.length < 1 && <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Tải</div>
                                    </div>}
                                </Upload>
                            </Form.Item>

                        </div>

                    </div>

                    <div className='row'>

                        <div className='col-md-5'>
                            <Form.Item name="address" label="Địa chỉ"
                                className=' d-block'>
                                <Input className='form-control' placeholder='Nhập địa chỉ' />
                            </Form.Item>
                        </div>

                        <div className='col-md-4'>
                            <Form.Item name="phone" label="SĐT"
                                className='required d-block'>
                                <Input className='form-control' placeholder='Nhập số điện thoại' />
                            </Form.Item>
                        </div>

                    </div>

                </div>

                <div className='d-flex justify-content-center'>
                    <button type="submit" className="btn btn-primary text-center" style={{ marginRight: 10, padding: '10px 10px' }}>
                        Lưu
                    </button>

                    <button type="button" className="btn btn-secondary text-center" style={{ marginLeft: 10, padding: '10px 10px' }} onClick={resetForm}>
                        Làm mới
                    </button>
                </div>
            </Form>
        </>
    )
}