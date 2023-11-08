import { View, StyleSheet, Dimensions } from "react-native";
import {
  ActivityIndicator,
  Button,
  List,
  Text,
  Surface,
} from "react-native-paper";
import React, { useCallback, useEffect, useState } from "react";
import { background, primaryColor, secondaryColor } from "../../../components/colors";
import { DatePickerModal } from "react-native-paper-dates";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { registerTranslation } from "react-native-paper-dates";
import axios from "axios";
registerTranslation("en", {
  save: "Save",
  selectSingle: "Select date",
  selectMultiple: "Select dates",
  selectRange: "Select period",
  notAccordingToDateFormat: (inputFormat) =>
    `Date format must be ${inputFormat}`,
  mustBeHigherThan: (date) => `Must be later then ${date}`,
  mustBeLowerThan: (date) => `Must be earlier then ${date}`,
  mustBeBetween: (startDate, endDate) =>
    `Must be between ${startDate} - ${endDate}`,
  dateIsDisabled: "Day is not allowed",
  previous: "Previous",
  next: "Next",
  typeInDate: "Type in date",
  pickDateFromCalendar: "Pick date from calendar",
  close: "Close",
});

type DateRange = {
  startDate: Date | undefined;
  endDate: Date | undefined;
};

type ResponseData = {
  numberPublications: string;
  numberLikes: string;
  numberComments: string;
  numberSharedPosts: string;
};

type StringRange = {
  startDate: string | undefined;
  endDate: string | undefined;
};

const { width } = Dimensions.get("window");



const UserStats = () => {
  const [data, setData] = useState<ResponseData | null>(null);

  const [open, setOpen] = useState(false);

  // Last Week, Last Month, Last Year, Custom
  const [selectedPeriod, setSelectedPeriod] = useState("Last Week");

  // set initial period as "Last Week"
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const previousDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 7
  );
  const previousYear = previousDay.getFullYear();
  const previousMonth = previousDay.getMonth() + 1;
  const previousDate = previousDay.getDate();
  const formattedDate = `${year}-${month}-${day}`;
  const formattedPreviousDate = `${previousYear}-${previousMonth}-${previousDate}`;
  const [selectedDates, setSelectedDates] = useState<StringRange>({
    startDate: formattedPreviousDate,
    endDate: formattedDate,
  });

  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const threeSixtyFiveDaysAgo = new Date(
    today.getTime() - 365 * 24 * 60 * 60 * 1000
  );

  const [range, setRange] = useState<DateRange>({
    startDate: sevenDaysAgo,
    endDate: today,
  });

  const [isLoading, setIsLoading] = useState(true);

  const [expanded, setExpanded] = React.useState(false);

  const handleEffect = async () => {
    if (range.startDate && range.endDate) {
      setIsLoading(true);

      const startDate: Date = new Date(range.startDate);
      const startYear: number = startDate.getFullYear();
      const startMonth: string = (startDate.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const startDay: string = startDate.getDate().toString().padStart(2, "0");
      const strStartDate: string = `${startYear}-${startMonth}-${startDay}`;

      const endDate: Date = new Date(range.endDate);

      const endYear: number = endDate.getFullYear();
      const endMonth: string = (endDate.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const endDay: string = endDate.getDate().toString().padStart(2, "0");

      const strEndDate: string = `${endYear}-${endMonth}-${endDay}`;

      setSelectedDates({ startDate: strStartDate, endDate: strEndDate });

      const username = await AsyncStorage.getItem("username");
      const url = `${API_URL}/content/statistics/post/${username}?startdate=${strStartDate}&finaldate=${strEndDate}`;

      try {
        const data = await axios.get(url, {});
        setData(data.data);
        setIsLoading(false);
      } catch (e) {
        alert("Error fetching data");
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    handleEffect();
  }, [range]);

  const onDismiss = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = useCallback(
    ({ startDate, endDate }: DateRange) => {
      setOpen(false);
      setRange({ startDate, endDate });
    },
    [setOpen, setRange]
  );

  const handlePressList = () => setExpanded(!expanded);

  const handleSelection = (period: string) => {
    setSelectedPeriod(period);
    setExpanded(false);

    if (period === "Custom") {
      setOpen(true);
    } else if (period === "Last 7 days") {
      setRange({ startDate: sevenDaysAgo, endDate: today });
    } else if (period === "Last 30 days") {
      setRange({ startDate: thirtyDaysAgo, endDate: today });
    } else if (period === "Last 365 days") {
      setRange({ startDate: threeSixtyFiveDaysAgo, endDate: today });
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Surface style={styles.surface}>
          <Text style={{ fontSize: 24, margin: 20 }}>Period: </Text>

          <List.Accordion
            style={{ width: width * 0.5 }}
            title={selectedPeriod}
            id="1"
            expanded={expanded}
            onPress={handlePressList}
          >
            <List.Item
              title="Last 7 days"
              onPress={() => handleSelection("Last 7 days")}
            />
            <List.Item
              title="Last 30 days"
              onPress={() => handleSelection("Last 30 days")}
            />
            <List.Item
              title="Last 365 days"
              onPress={() => handleSelection("Last 365 days")}
            />
            <List.Item
              title="Custom"
              onPress={() => handleSelection("Custom")}
            />
          </List.Accordion>
        </Surface>
      </View>

      <DatePickerModal
        locale="en"
        mode="range"
        visible={open}
        onDismiss={onDismiss}
        startDate={range.startDate}
        endDate={range.endDate}
        onConfirm={onConfirm}
      />

      <View>
        {isLoading ? (
          <View style={{ justifyContent: "center", height: width }}>
            <ActivityIndicator size="large" animating={true} />
          </View>
        ) : (
          <View>
            <Surface style={styles.datesSurface}>
              <Text style={{ fontSize: 20, marginBottom:5,marginLeft:5}}>📅 From: {range.startDate?.toDateString()}</Text>
              <Text style={{ fontSize: 20,marginLeft:5}}>📅 To: {range.endDate?.toDateString()}</Text>
            </Surface>
            <Surface style={styles.infoSurface}>
              <Text style={{ fontSize: 22}}>Posts made: {data?.numberPublications} ✍️</Text>
            </Surface>
            <Surface style={styles.infoSurface}>
              <Text style={{ fontSize: 22}}>Likes received: {data?.numberLikes} ❤️</Text>
            </Surface>
            <Surface style={styles.infoSurface}>
              <Text style={{ fontSize: 22}}>Comments received: {data?.numberComments} 💬</Text>
            </Surface>
            <Surface style={styles.infoSurface}>
              <Text style={{ fontSize: 22}}>Shared posts: {data?.numberSharedPosts} 📫</Text>
            </Surface>
          </View>
        )}
      </View>
    </View>
  );
};

export default UserStats;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: background,
    flex: 1,
  },
  surface: {
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: width*0.05,
    marginBottom: width*0.08,
    width: width * 0.9,
    backgroundColor: secondaryColor,
    borderColor: primaryColor,
    borderWidth: 2,
  },
  bottomSurface: {
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.9,
    marginBottom: 10,
    backgroundColor: secondaryColor,
    borderColor: primaryColor,
    borderWidth: 2,
  },
  datesSurface: {
    padding: 10,
    alignItems: "flex-start",
    justifyContent: "center",
    width: width * 0.9,
    marginBottom: 20,
    backgroundColor: secondaryColor,
    borderColor: primaryColor,
    borderWidth: 2,
  },
  infoSurface: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.9,
    marginBottom: 10,
    backgroundColor: secondaryColor,
    borderColor: primaryColor,
    borderWidth: 2,
  },
});
