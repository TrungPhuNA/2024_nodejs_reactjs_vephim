export const toggleShowLoading = ( boolean ) =>
{
	return {
		type: 'LOADING',
		showLoading: boolean,
	};
}