import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { ProgressCircle } from "react-native-svg-charts";

const screenWidth = Dimensions.get("window").width;

const ADMIN_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWY5ODA1YTBkYzc5MDgzZjFhYmJkYTciLCJpYXQiOjE3MTA4NTAxMzh9.y8158XhPNg3jDPAZKpS8sw7k8fEBAy-fUQTnmXHR4-E";
const STAFF_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWY5N2FlZDZjNTk3MDQyNjdmN2JmMzIiLCJpYXQiOjE3MTA4NDg3NDl9.MrbIEIMRLLubryoHZgvTBGhQeC0L79ZSgtz1iWgZaVo";

function Charts() {
  [quotations, setQuotations] = useState();

  [amount, setAmount] = useState();

  const totalAmount = () => {
    if (amount) {
      return amount + 3;
    }
  };

  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [0, 0, amount !== undefined ? amount : 0, 0, 0, 0],
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: "#1050E7",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#FFFFFF", //background
    backgroundGradientToOpacity: 0.5,
    color: () => `#AB2330`,
    strokeWidth: 3, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
    yAxisSuffix: "",
  };

  const isFocus = useIsFocused();

  const getAllQuotation = async () => {
    try {
      const response = await fetch(
        "http://10.0.3.2:5000/api/standard-quotations/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setQuotations(data.data);
      setAmount(data.data.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (isFocus) {
      getAllQuotation();
    }
  }, [isFocus]);

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text
          style={{
            textAlign: "center",
            fontSize: 18,
            padding: 16,
            color: "#F5BD02",
          }}
        >
          Quantity Quotation Chart
        </Text>

        <BarChart
          data={data}
          width={screenWidth}
          height={220}
          yAxisLabel="SL :"
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
            color: "#F5BD02",
          }}
        >
          Successfully {amount} / {amount + 3} Quotation Chart
        </Text>
        <View style={{ flex: 1 }}>
          <ProgressCircle
            style={{ height: 200 }}
            progress={amount / (amount + 3)}
            progressColor={"#AB2330"}
          />
        </View>
      </View>
    </ScrollView>
  );
}

export default Charts;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FBE8A5",
  },
});
