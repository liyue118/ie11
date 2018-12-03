import { stringify } from 'qs';
import request from '../utils/request';
import {Ip} from '../utils/utils';
//AllTeamMember
export async function AllTeamMember(params) {
  return request(Ip + '/api/event/AllTeamMember', {
    method: 'POST',
    body: params,
  });
}
//api/event/EventTeamMember
export async function EventTeamMember(params) {
    return request(Ip + '/api/event/EventTeamMember', {
      method: 'POST',
      body: params,
    });
  }
  //api/event/EventTeamMemberAddition
export async function EventTeamMemberAddition(params) {
    return request(Ip + '/api/event/EventTeamMemberAddition', {
      method: 'POST',
      body: params,
    });
  }
//api/event/EventTeamMemberDelete
export async function EventTeamMemberDelete(params) {
    return request(Ip + '/api/event/EventTeamMemberDelete', {
      method: 'POST',
      body: params,
    });
  }
//api/event/EventSpeakerList
export async function EventSpeakerList(params) {
    return request(Ip + '/api/event/EventSpeakerList', {
      method: 'POST',
      body: params,
    });
  }
//api/event/EventSpeakerChecked
export async function EventSpeakerChecked(params) {
    return request(Ip + '/api/event/EventSpeakerChecked', {
      method: 'POST',
      body: params,
    });
  }
//api/event/EventSponsorList
export async function EventSponsorList(params) {
    return request(Ip + '/api/event/EventSponsorList', {
      method: 'POST',
      body: params,
    });
  }
//api/event/EventAttendeeListByStatus
export async function EventAttendeeListByStatus(params) {
    return request(Ip + '/api/event/EventAttendeeListByStatus', {
      method: 'POST',
      body: params,
    });
  }
//api/event/EventAttendeeDelete
export async function EventAttendeeDelete(params) {
  return request(Ip + '/api/event/EventAttendeeDelete', {
      method: 'POST',
      body: params,
    });
  }
//api/event/EventAttendeeListByFilter
export async function EventAttendeeListByFilter(params) {
    return request(Ip + '/api/event/EventAttendeeListByFilter', {
      method: 'POST',
      body: params,
    });
  }
//api/event/EventDiscountList
export async function EventDiscountList(params) {
    return request(Ip + '/api/event/EventDiscountList', {
      method: 'POST',
      body: params,
    });
}
//api/event/EventAllPaymentList
export async function EventAllPaymentList(params) {
  return request(Ip + '/api/event/EventAllPaymentList', {
    method: 'POST',
    body: params,
  });
}
//EventAttendeeStatusUpdate
export async function EventAttendeeStatusUpdate(params) {
  return request(Ip + '/api/event/EventAttendeeStatusUpdate', {
    method: 'POST',
    body: params,
  });
}
//api/event/EventAttendeeAddition
export async function EventAttendeeAddition(params) {
  return request(Ip + '/api/event/EventAttendeeAddition', {
    method: 'POST',
    body: params,
  });
}
//ContactAllList
export async function ContactAllList(params) {
  return request(Ip + '/api/contact/ContactAllList', {
    method: 'POST',
    body: params,
  });
}

export async function EventAttendeeRegisterDetail(params) {
  return request(Ip + '/api/event/EventAttendeeRegisterDetail', {
    method: 'POST',
    body: params,
  });
}
export async function EventAttendeeCancelUpdate(params) {
  return request(Ip + '/api/event/EventAttendeeCancelUpdate', {
    method: 'POST',
    body: params,
  });
}

export async function EventAttendeeStatusBatchUpdate(params) {
  return request(Ip + '/api/event/EventAttendeeStatusBatchUpdate', {
    method: 'POST',
    body: params,
  });
}
export async function EventAttendeeCheck(params) {
  return request(Ip + '/api/event/EventAttendeeCheck', {
    method: 'POST',
    body: params,
  });
}
//EventAttendeePaymentUpdate
export async function EventAttendeePaymentUpdate(params) {
  return request(Ip + '/api/event/EventAttendeePaymentUpdate', {
    method: 'POST',
    body: params,
  });
}
//EventAttendeeBatchCheck
export async function EventAttendeeBatchCheck(params) {
  return request(Ip + '/api/event/EventAttendeeBatchCheck', {
    method: 'POST',
    body: params,
  });
}
//EventAttendeePaymentBatchUpdate
export async function EventAttendeePaymentBatchUpdate(params) {
  return request(Ip + '/api/event/EventAttendeePaymentBatchUpdate', {
    method: 'POST',
    body: params,
  });
}
//EventAttendeeCancelBatchUpdate
export async function EventAttendeeCancelBatchUpdate(params) {
  return request(Ip + '/api/event/EventAttendeeCancelBatchUpdate', {
    method: 'POST',
    body: params,
  });
}
//EventAttendeeDiscountBatchUpdate
export async function EventAttendeeDiscountBatchUpdate(params) {
  return request(Ip + '/api/event/EventAttendeeDiscountBatchUpdate', {
    method: 'POST',
    body: params,
  });
}
//EventAttendeeEdit
export async function EventAttendeeEdit(params) {
  return request(Ip + '/api/event/EventAttendeeEdit', {
    method: 'POST',
    body: params,
  });
}
//api/event/EventAttendeeDetail
export async function EventAttendeeDetail(params) {
  return request(Ip + '/api/event/EventAttendeeDetail', {
    method: 'POST',
    body: params,
  });
}
//EventAttendeeRecoverUpdate
export async function EventAttendeeRecoverUpdate(params) {
  return request(Ip + '/api/event/EventAttendeeRecoverUpdate', {
    method: 'POST',
    body: params,
  });
}
//RegistraionIsFull
export async function RegistraionIsFull(params) {
  return request(Ip + '/api/event/RegistraionIsFull', {
    method: 'POST',
    body: params,
  });
}
