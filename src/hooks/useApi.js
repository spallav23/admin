import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';

// Generic hook for API calls
export const useApi = (apiFunction, dependencies = [], options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    immediate = true,
    onSuccess,
    onError,
    showSuccessMessage = false,
    showErrorMessage = true,
    successMessage = 'Operation completed successfully',
  } = options;

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiFunction(...args);
      
      if (result.success) {
        setData(result.data || result);
        
        if (showSuccessMessage) {
          message.success(successMessage);
        }
        
        if (onSuccess) {
          onSuccess(result);
        }
        
        return result;
      } else {
        const errorMsg = result.error || 'Operation failed';
        setError(errorMsg);
        
        if (showErrorMessage) {
          message.error(errorMsg);
        }
        
        if (onError) {
          onError(result);
        }
        
        return result;
      }
    } catch (err) {
      const errorMsg = err.message || 'An unexpected error occurred';
      setError(errorMsg);
      
      if (showErrorMessage) {
        message.error(errorMsg);
      }
      
      if (onError) {
        onError(err);
      }
      
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [apiFunction, onSuccess, onError, showSuccessMessage, showErrorMessage, successMessage]);

  useEffect(() => {
    if (immediate && apiFunction) {
      execute();
    }
  }, dependencies);

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute,
  };
};

// Hook for paginated API calls
export const usePaginatedApi = (apiFunction, initialParams = {}, options = {}) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const { showErrorMessage = true } = options;

  const fetchData = useCallback(async (newParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const mergedParams = { ...params, ...newParams };
      const result = await apiFunction(mergedParams);
      
      if (result.success) {
        setData(result.data || []);
        
        if (result.pagination) {
          setPagination(prev => ({
            ...prev,
            ...result.pagination,
            total: result.total || result.pagination.total || 0,
          }));
        }
        
        return result;
      } else {
        const errorMsg = result.error || 'Failed to fetch data';
        setError(errorMsg);
        
        if (showErrorMessage) {
          message.error(errorMsg);
        }
        
        return result;
      }
    } catch (err) {
      const errorMsg = err.message || 'An unexpected error occurred';
      setError(errorMsg);
      
      if (showErrorMessage) {
        message.error(errorMsg);
      }
      
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [apiFunction, params, showErrorMessage]);

  const handleTableChange = useCallback((newPagination, filters, sorter) => {
    const newParams = {
      page: newPagination.current,
      limit: newPagination.pageSize,
      ...filters,
    };

    if (sorter.field) {
      newParams.sortBy = sorter.field;
      newParams.sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc';
    }

    setParams(prev => ({ ...prev, ...newParams }));
    fetchData(newParams);
  }, [fetchData]);

  const search = useCallback((searchParams) => {
    const newParams = {
      ...params,
      ...searchParams,
      page: 1, // Reset to first page when searching
    };
    
    setParams(newParams);
    fetchData(newParams);
  }, [params, fetchData]);

  const refresh = useCallback(() => {
    fetchData(params);
  }, [fetchData, params]);

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    pagination,
    loading,
    error,
    handleTableChange,
    search,
    refresh,
    setParams,
  };
};

// Hook for form submissions
export const useApiSubmit = (apiFunction, options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    onSuccess,
    onError,
    showSuccessMessage = true,
    showErrorMessage = true,
    successMessage = 'Operation completed successfully',
  } = options;

  const submit = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiFunction(data);
      
      if (result.success) {
        if (showSuccessMessage) {
          message.success(successMessage);
        }
        
        if (onSuccess) {
          onSuccess(result);
        }
        
        return result;
      } else {
        const errorMsg = result.error || 'Operation failed';
        setError(errorMsg);
        
        if (showErrorMessage) {
          message.error(errorMsg);
        }
        
        if (onError) {
          onError(result);
        }
        
        return result;
      }
    } catch (err) {
      const errorMsg = err.message || 'An unexpected error occurred';
      setError(errorMsg);
      
      if (showErrorMessage) {
        message.error(errorMsg);
      }
      
      if (onError) {
        onError(err);
      }
      
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [apiFunction, onSuccess, onError, showSuccessMessage, showErrorMessage, successMessage]);

  return {
    submit,
    loading,
    error,
  };
};
