import { getMethod } from "./apiService"

export const CONTACT_SERVICE = {
	getList: async (filter) => {
		return await getMethod('/admin/contact', filter)
	}
}