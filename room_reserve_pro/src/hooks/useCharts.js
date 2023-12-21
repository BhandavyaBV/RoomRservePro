import React from 'react'
import { getChartData } from '../Services/dashboardService';
import { useQuery } from '@tanstack/react-query';

const useCharts = () => {
    const {data, isLoading} = useQuery({ queryKey: ['charts'], queryFn: getChartData });
    return {data, isLoading}
}

export default useCharts