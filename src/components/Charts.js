import React from "react";
import { Dimensions, View, Text, ScrollView } from "react-native";
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const data = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
    },
  ],
};

const chartConfig = {
  backgroundGradientFrom: "#1050E7",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#FFFFFF", //background
  backgroundGradientToOpacity: 0.5,
  color: () => `#1050E7`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
};

const Charts = () => {
  return (
    <ScrollView>
      <View>
        <Text
          style={{
            textAlign: "center",
            fontSize: 18,
            padding: 16,
            color: "#1050E7",
          }}
        >
          Successfully Quotation Chart
        </Text>
        <BarChart
          data={data}
          width={screenWidth}
          height={220}
          yAxisLabel="$"
          chartConfig={chartConfig}
          //verticalLabelRotation={30}
        />
      </View>
      <View>
        <Text
          style={{
            textAlign: "center",
            fontSize: 18,
            padding: 16,
            color: "#1050E7",
          }}
        >
          Successfully Quotation Chart
        </Text>
        <BarChart
          data={data}
          width={screenWidth}
          height={220}
          yAxisLabel="$"
          chartConfig={chartConfig}
          //verticalLabelRotation={30}
        />
      </View>
      <View>
        <Text
          style={{
            textAlign: "center",
            fontSize: 18,
            padding: 16,
            color: "#1050E7",
          }}
        >
          Successfully Quotation Chart
        </Text>
        <BarChart
          data={data}
          width={screenWidth}
          height={220}
          yAxisLabel="$"
          chartConfig={chartConfig}
          //verticalLabelRotation={30}
        />
      </View>
      <View>
        <Text
          style={{
            textAlign: "center",
            fontSize: 18,
            padding: 16,
            color: "#1050E7",
          }}
        >
          Successfully Quotation Chart
        </Text>
        <BarChart
          data={data}
          width={screenWidth}
          height={220}
          yAxisLabel="$"
          chartConfig={chartConfig}
          //verticalLabelRotation={30}
        />
      </View>
    </ScrollView>
  );
};

export default Charts;
