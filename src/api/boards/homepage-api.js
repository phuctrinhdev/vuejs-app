import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES } from '../../config/constant'
import { mapFileFromApi } from '../../helpers/common' 

const url_read    = getServiceUrl(SERVICE_TYPES.BOARDS.BOARD_HOMEPAGE_READ, 1) // Read API URL, Version
//let url_list       = url_read + SERVICE_EXTEND_TYPES.LIST

export default class BoardAPI {
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }
  mapSystemNoticeFromApi(model){
    return {
      id              : model.noticeId,
      country_code          : model.countryCode,
      board_code            : model.boardCode,
      solution_id           : model.solutionId,
      chain_id              : model.chainId,
      registration_date     : model.registrationDate,
      modification_date     : model.modificationDate,
      read_count            : model.readCount,    
      created_by_user_name  : model.createdByUserName,
      created_by_user_id    : model.createdByUserID,
      created_by_user_role    : model.createdByUserRole,
      shop_id               : model.shopId,
      file_attachment_count : model.fileAttachmentCount,
      post_on_top           : model.postOnTop,
      solution_ids          : model.solutionIds,
      business_type_codes     : model.businessTypeCodes,
      title                 : model.title,
      contents              : model.contents,
      master_only_reading   : model.masterOnlyReading,
    }
  }
  mapSystemBoardFromApi(model){
    return {
      id                    : model.boardId,
      country_code          : model.countryCode,
      board_code            : model.boardCode,
      solution_id           : model.solutionId,
      chain_id              : model.chainId,
      registration_date     : model.registrationDate,
      modification_date     : model.modificationDate,
      read_count            : model.readCount,    
      created_by_user_name  : model.createdByUserName,
      created_by_user_id    : model.createdByUserID,
      created_by_user_role    : model.createdByUserRole,
      shop_id               : model.shopId,
      file_attachment_count : model.fileAttachmentCount,
      parent_id             : model.parentId,
      depth                 : model.depth,
      relatedBoards         : [],
      title                 : model.title,
      contents              : model.contents,
      master_only_reading   : model.masterOnlyReading,
    }
  }
  mapChainNoticeFromApi(model){
    return {
      id                    : model.noticeId,
      country_code          : model.countryCode,
      board_code            : model.boardCode,
      solution_id           : model.solutionId,
      chain_id              : model.chainId,
      registration_date     : model.registrationDate,
      modification_date     : model.modificationDate,
      read_count            : model.readCount,    
      created_by_user_name  : model.createdByUserName,
      created_by_user_id    : model.createdByUserID,
      created_by_user_role    : model.createdByUserRole,
      shop_id               : model.shopId,
      file_attachment_count : model.fileAttachmentCount,
      post_on_top           : model.postOnTop,
      solution_ids          : model.solutionIds,
      business_type_codes     : model.businessTypeCodes,
      title                 : model.title,
      contents              : model.contents,
      master_only_reading   : model.masterOnlyReading,
    }
  }
  mapChainBoardFromApi(model){
    return {
      id                    : model.boardId,
      country_code          : model.countryCode,
      board_code            : model.boardCode,
      solution_id           : model.solutionId,
      chain_id              : model.chainId,
      registration_date     : model.registrationDate,
      modification_date     : model.modificationDate,
      read_count            : model.readCount,    
      created_by_user_name  : model.createdByUserName,
      created_by_user_id    : model.createdByUserID,
      created_by_user_role    : model.createdByUserRole,
      shop_id               : model.shopId,
      file_attachment_count : model.fileAttachmentCount,
      parent_id             : model.parentId,
      depth                 : model.depth,
      relatedBoards         : [],
      title                 : model.title,
      contents              : model.contents,
      master_only_reading   : model.masterOnlyReading,
    }
  }
  mapSystemPopupFromApi(model){
    return {
      popup_id              : model.popUpId,
      country_code          : model.countryCode,
      popup_type            : model.popupType,
      shop_id               : model.shopId,
      chain_id              : model.chainId,
      created_by_user_name  : model.createdByUserName,
      created_by_user_id    : model.createdByUserID,
      solution_ids          : model.solutionIds,
      business_type_codes   : model.businessTypeCodes,
      registration_date     : model.registrationDate,
      modification_date     : model.modificationDate,
      title                 : model.title,
      start_date_ts        : model.startDateTS,
      end_date_ts          : model.endDateTS,
      top                  : model.top, 
      left                 : model.left, 
      width                : model.width, 
      height               : model.height, 
      contents             : model.contents, 
      link_url             : model.linkURL,
      link_target          : model.linkTarget,
      never_see_period     : model.neverSeePeriod,
      status               : model.status
    }
  }
  mapChainPopupFromApi(model){
    return {
      popup_id              : model.popUpId,
      country_code          : model.countryCode,
      popup_type            : model.popupType,
      shop_id               : model.shopId,
      chain_id              : model.chainId,
      created_by_user_name  : model.createdByUserName,
      created_by_user_id    : model.createdByUserID,
      solution_ids          : model.solutionIds,
      business_type_codes   : model.businessTypeCodes,
      registration_date     : model.registrationDate,
      modification_date     : model.modificationDate,
      title                 : model.title,
      start_date_ts        : model.startDateTS,
      end_date_ts          : model.endDateTS,
      top                  : model.top, 
      left                 : model.left, 
      width                : model.width, 
      height               : model.height, 
      contents             : model.contents, 
      link_url             : model.linkURL,
      link_target          : model.linkTarget,
      never_see_period     : model.neverSeePeriod,
      status               : model.status
    }
  }
  mapFieldFromApi(model){
    let result= {
      system_notices:[],
      system_boards:[],
      chain_notices:[],
      chain_boards:[],
      system_popups:[],
      chain_popups:[]

    }
    if(model.systemNotices.length > 0){
      for(let i in model.systemNotices){
        result.system_notices.push(this.mapSystemNoticeFromApi(model.systemNotices[i]))
      }
    }
    if(model.systemBoards.length > 0){
      for(let i in model.systemBoards){
        result.system_boards.push(this.mapSystemBoardFromApi(model.systemBoards[i]))
      }
    }
    if(model.chainNotices.length > 0){
      for(let i in model.chainNotices){
        result.chain_notices.push(this.mapChainNoticeFromApi(model.chainNotices[i]))
      }
    }
    if(model.chainBoards.length  > 0){
      for(let i in model.chainBoards){
        result.chain_boards.push(this.mapChainBoardFromApi(model.chainBoards[i]))
      }
    }
    if(model.systemPopups.length  > 0){
      for(let i in model.systemPopups){
        result.system_popups.push(this.mapSystemPopupFromApi(model.systemPopups[i]))
      }
    }
    if(model.chainPopups.length > 0){
      for(let i in model.chainPopups){
        result.chain_popups.push(this.mapChainPopupFromApi(model.chainPopups[i]))
      }
    }
    return result
  }

  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK

    if(response.data.isOK)
      this.result.data = this.mapFieldFromApi(response.data.result)
  }

  async getHompageBoardsAsync(query) {
    let data_send = {
      shopId      : query.shop_id,
      solutionId  : query.solution_id,
      businessTypeCode: query.business_type_code,

      chainId     : query.chain_id,
      branchType  : query.branch_type,
      todayTS     : query.today_ts,
      countryCode : query.country_code,
    }
    
    try {
      const response = await this.http.post(url_read, data_send)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK
      if(response.data.isOK){
        this.result.data = this.mapFieldFromApi(response.data.result)
        if(this.result.data.file_attachment_count > 0)
        {
          let files = []
          for(let item in response.data.result.fileAttachments){
            files.push(mapFileFromApi(response.data.result.fileAttachments[item]))
          }
          this.result.data.files = files
        }
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

}