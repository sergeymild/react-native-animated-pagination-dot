/**
 * Created by rouge on 11/09/2019.
 * Converted to Functional component. on 21/09/2021
 */
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';

export const defaultEmptyDotSize = 3;

const EmptyDot: React.FC<{
  sizeRatio: number;
}> = (props) => {
  return (
    <View
      style={[
        styles.base,
        {
          width: defaultEmptyDotSize * props.sizeRatio,
          height: defaultEmptyDotSize * props.sizeRatio,
          margin: defaultEmptyDotSize * props.sizeRatio,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: 'yellow',
    opacity: 0.3,
  },
});

export default memo(EmptyDot);
