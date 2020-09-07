import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/users',
    method: 'post',
    data
  })
}

export function addVote(data) {
  return request({
    url: 'aaa/voteAndApply/addVote',
    method: 'post',
    data
  })
}

export function deleteVote(data) {
  return request({
    url: 'aaa/voteAndApply/delVote',
    method: 'post',
    data
  })
}

export function editVote(data) {
  return request({
    url: 'aaa/voteAndApply/updateVote',
    method: 'post',
    data
  })
}

export function addApply(data) {
  return request({
    url: 'aaa/voteAndApply/addApply',
    method: 'post',
    data
  })
}

export function deleteApply(data) {
  return request({
    url: 'aaa/voteAndApply/delApply',
    method: 'post',
    data
  })
}

export function editApply(data) {
  return request({
    url: 'aaa/voteAndApply/updateApply',
    method: 'post',
    data
  })
}

export function updateIntegralRule(data) {
  return request({
    url: 'aaa/integral/updateIntegralRule',
    method: 'post',
    data
  })
}

export function showIntegralRule(data) {
  return request({
    url: 'aaa/integral/showIntegralRule',
    method: 'post',
    data
  })
}

export function getAdvertisers(data) {
  return request({
    url: 'aaa/ad/getAdvertisers?number=0&size=999',
    method: 'get'
  })
}

export function addAd(data) {
  return request({
    url: 'aaa/ad/addAd',
    method: 'post',
    data
  })
}

export function updateAd(data) {
  return request({
    url: 'aaa/ad/updateAd',
    method: 'post',
    data
  })
}

export function addAdvertisers(data) {
  return request({
    url: 'aaa/ad/addAdvertisers',
    method: 'post',
    data
  })
}

export function updateAdvertisers(data) {
  return request({
    url: 'aaa/ad/updateAdvertisers',
    method: 'post',
    data
  })
}

export function getAllCoupon(data) {
  return request({
    url: 'aaa/coupon/getAllCoupon?number=0&size=999',
    method: 'get'
  })
}

export function addCoupon(data) {
  return request({
    url: 'aaa/coupon/addCoupon',
    method: 'post',
    data
  })
}

export function updateCoupon(data) {
  return request({
    url: 'aaa/coupon/updateCoupon',
    method: 'post',
    data
  })
}

export function addCouponIssue(data) {
  return request({
    url: 'aaa/coupon/addCouponIssue',
    method: 'post',
    data
  })
}

export function updateCouponIssue(data) {
  return request({
    url: 'aaa/coupon/updateCouponIssue',
    method: 'post',
    data
  })
}
