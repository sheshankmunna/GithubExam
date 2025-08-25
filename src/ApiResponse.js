
class ApiResponse {
  constructor({ success, data = null, errorCode = null, message = '', requestId = null, pagination = null, metadata = null, timestamp = null }) {
    this.success = success;
    this.data = data;
    this.errorCode = errorCode;
    this.message = message;
    this.timestamp = timestamp || new Date().toISOString();
    this.requestId = requestId;
    this.pagination = pagination;
    // If metadata contains pagination, prefer it
    if (metadata && metadata.pagination) {
      this.pagination = metadata.pagination;
    }
  }

  /**
   * Pagination metadata structure:
   * {
   *   items: Array, // paginated items
   *   page: Number, // current page
   *   size: Number, // page size
   *   totalElements: Number, // total items
   *   totalPages: Number // total pages
   * }
   */
  toJSON() {
    return {
      success: this.success,
      data: this.data ?? null,
      errorCode: this.errorCode ?? null,
      message: this.message ?? '',
      timestamp: this.timestamp,
      requestId: this.requestId ?? null,
      pagination: this.pagination ?? null
    };
  }

  static success(data, message = "Request successful", pagination = null) {
    let metadata = null;
    if (Array.isArray(data) && pagination) {
      metadata = { pagination };
    } else if (pagination) {
      metadata = { pagination };
    }
    return new ApiResponse({
      success: true,
      data,
      message,
      metadata
    });
  }

  static error(errorCode, message = "Something went wrong", requestId = null) {
    return new ApiResponse({
      success: false,
      errorCode,
      message,
      requestId,
      timestamp: new Date().toISOString(),
      metadata: null
    });
  }
}

ApiResponse.Builder = class {
  constructor() {
    this.response = {
      success: false,
      data: null,
      errorCode: null,
      message: '',
      requestId: null,
      pagination: null,
      metadata: null,
      timestamp: null
    };
  }
  withSuccess(success) {
    this.response.success = success;
    return this;
  }
  withData(data) {
    this.response.data = data;
    return this;
  }
  withErrorCode(errorCode) {
    this.response.errorCode = errorCode;
    return this;
  }
  withMessage(message) {
    this.response.message = message;
    return this;
  }
  withRequestId(requestId) {
    this.response.requestId = requestId;
    return this;
  }
  withPagination(pagination) {
    this.response.pagination = pagination;
    return this;
  }
  withMetadata(metadata) {
    this.response.metadata = metadata;
    return this;
  }
  build() {
    this.response.timestamp = new Date().toISOString();
    return new ApiResponse(this.response);
  }
};
