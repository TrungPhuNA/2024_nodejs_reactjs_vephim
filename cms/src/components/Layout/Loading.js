import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Spin, Space } from 'antd';

function Loading({ isShowLoading }) {
    if (isShowLoading) {
        return (
            <div className="zingLoading" id="zingLoading">
                <div className="gtWaving">
                    <Space size="middle">
                        <Spin style={{ color: '#ee4d2d' }} size="large" />
                    </Space>
                </div>
            </div>
        )
    }
    return null
}
const mapStateToProps = function (state) {
    return {
        isShowLoading: state.commonReducer.showLoading,
    }
}

export default withRouter(connect(mapStateToProps)(Loading))
