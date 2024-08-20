// @ts-nocheck
import { toggleShowLoading } from "../redux/actions/common";
import { getMethod} from "./apiService";
import { buildFilter, timeDelay } from "./common";

export const DASHBOARD_SERVICE = {
	getByFilter: async (params, setData, dispatch) => {
		try {
			let filters = buildFilter(params);
			dispatch(toggleShowLoading(true))
			const response = await getMethod('/admin/statistical', filters);
			dispatch(toggleShowLoading(false))

			// await timeDelay(2000);
			if (response?.status === 'success') {
				setData(response?.data);
				return response
			} else {
				setData(null);
				return null
			}
			
		} catch (error) {
			console.log("dashboard -------> ", error);
			setData(null);
			dispatch(toggleShowLoading(false))
	
		}
	}
}