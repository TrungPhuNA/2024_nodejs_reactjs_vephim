// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ProfileSetting } from "../../components/Profile/ProfileSetting";
import { Tabs, message } from "antd";
import Widget from "../../components/Widget/Widget";
import { ChangePassword } from "../../components/Profile/ChangePassword";
import { ProfileInfo } from "../../components/Profile/ProfileInfo";
import { AUTH_SERVICE } from "../../services/authService";
import Breadcrumbs from "../../components/Breadbrumbs/Breadcrumbs";

export const ProfileContainer = () =>
{

	const [ profileData, setProfileData ] = useState();

	useEffect( async () =>
	{
		getProfile()
	}, [] );

	const getProfile = async () =>
	{
		const response = await AUTH_SERVICE.getProfile();
		if ( response?.status == 'success' )
		{
			setProfileData( response?.data );
		} else
		{
			message.error( response?.message || 'error' );
		}
	}

	const items = [
		{
			key: '1',
			label: `Profile Info`,
			children: <ProfileInfo
				profileData={ profileData }
				getProfile={ getProfile }
			></ProfileInfo>
		},
		{
			key: '2',
			label: `Profile Setting`,
			children: <ProfileSetting
				profileData={ profileData }
				getProfile={ getProfile }
			></ProfileSetting>
		},
		{
			key: '3',
			label: `Change password`,
			children: <ChangePassword></ChangePassword>
		},
	];
	return (
		<>
			<Breadcrumbs title={ "Tài khoản" } />
			<div className="w-75 mx-auto">
				<Widget>
					<Tabs defaultActiveKey="1" items={ items } style={ { paddingLeft: 20, paddingRight: 20 } }>

					</Tabs>
				</Widget>
			</div>
		</>
	);
};



