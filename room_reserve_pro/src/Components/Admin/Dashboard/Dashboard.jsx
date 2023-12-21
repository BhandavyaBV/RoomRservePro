import React, { useContext, useMemo } from "react";
import { adminContext } from "../../../contexts/AdminProvider";
import useCharts from "../../../hooks/useCharts";
import Chart from "react-apexcharts";
import { CircularProgress, Container } from "@mui/material";

const AdminDashboard = () => {
    const { redirectIfNotLoggedIn } = useContext(adminContext);

    redirectIfNotLoggedIn();
    const { data: chartData, isLoading } = useCharts();
    const chartFormattedData = useMemo(() => {
        return {
            bar: {
                options: {
                    chart: {
                        id: "basic-bar",
                    },
                    xaxis: {
                        categories: chartData?.barX || [],
                    },
                },
                series: [
                    {
                        name: "series-1",
                        data: chartData?.barY || [],
                    },
                ],
            },
            pie: {
                series: chartData?.pieY,
                options: {
                    chart: {
                        width: 380,
                        type: "pie",
                    },
                    labels: chartData?.pieX || [],
                },
            },
        };
    }, [chartData]);
    if (isLoading) return <div style={{height: "calc(100vh - 120px)"}} className="flex justify-center items-center "><CircularProgress /></div>;
    return (
        <Container>
            <div
                className="flex justify-between items-center"
                style={{ height: "calc(100vh - 120px)" }}
            >
                <Chart
                    options={chartFormattedData.bar.options}
                    series={chartFormattedData.bar.series}
                    type="bar"
                    width={500}
                />
                <Chart
                    options={chartFormattedData.pie.options}
                    series={chartFormattedData.pie.series}
                    type="pie"
                    width={500}
                />
            </div>
        </Container>
    );
};

export default AdminDashboard;
