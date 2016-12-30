import { combineReducers } from 'redux'
import LotteryType from './LotteryType'
import Product from './Product'
import LotteryRecord from './LotteryRecord'
import UserInfo from './UserInfo'

export default combineReducers({
    LotteryType, Product, LotteryRecord, UserInfo
})
