// @ts-nocheck
import axios from "axios";
import { toggleShowLoading } from "../redux/actions/common";
import { deleteMethod, getMethod, postMethod, putMethod } from "./apiService";
import { buildFilter, timeDelay } from "./common";
import { message } from "antd";

export const VOTE_SERVICE_CMS = {
	async getLists ( params )
	{
		let filters = await buildFilter( params );
		return await getMethod( '/admin/vote', filters );
	},

	async show ( id, params )
	{
		return await getMethod( `/admin/vote/show/${ id }`, params );
	},

	async delete ( id )
	{
		return await deleteMethod( `/admin/vote/delete/${ id }` );
	}
}
