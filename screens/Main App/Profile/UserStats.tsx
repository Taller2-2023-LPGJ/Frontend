import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import React, { useCallback, useEffect, useState } from "react";
import { background } from "../../../components/colors";
import { TouchableOpacity } from "react-native";
import { DatePickerModal } from "react-native-paper-dates";

import { registerTranslation } from "react-native-paper-dates";
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

type StringRange = {
  startDate: string | undefined;
  endDate: string | undefined;
};

const UserStats = () => {
  const [range, setRange] = useState<DateRange>({
    startDate: undefined,
    endDate: undefined,
  });
  const [open, setOpen] = useState(false);

  const clearDates = () => {
    setRange({ startDate: undefined, endDate: undefined });
    setSelectedDates({ startDate: undefined, endDate: undefined });
  };

  const [selectedDates, setSelectedDates] = useState<StringRange>({
    startDate: undefined,
    endDate: undefined,
  });

  useEffect(() => {
    if (range.startDate && range.endDate) {
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
    }
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

  return (
    <View style={styles.container}>
      <Button onPress={() => setOpen(true)} uppercase={false} mode="outlined">
        Pick range
      </Button>
      <DatePickerModal
        locale="en"
        mode="range"
        visible={open}
        onDismiss={onDismiss}
        startDate={range.startDate}
        endDate={range.endDate}
        onConfirm={onConfirm}
      />

      <Button onPress={clearDates}>Clear dates</Button>

      <Text>StartDate Date: {selectedDates.startDate}</Text>
      <Text>EndDate Date: {selectedDates.endDate}</Text>
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
});
