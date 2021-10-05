/**
 *
 * Created by rouge on 11/09/2019.
 * Converted to Typescript on 14/07/2020.
 * Converted to Functional component. on 21/09/2021
 */
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  ScrollView,
  View,
  ViewStyle,
  StyleProp,
  StyleSheet,
} from 'react-native';
import Dot from './component/Dot';
import EmptyDot, { defaultEmptyDotSize } from './component/EmptyDot';
import { usePrevious } from './util/DotUtils';

export interface IDotContainerProps {
  curPage: number;
  maxPage: number;
  sizeRatio?: number;
  activeDotColor: string;
  inActiveDotColor: string;
  vertical?: boolean;
}

const ONE_EMPTY_DOT_SIZE = defaultEmptyDotSize * defaultEmptyDotSize;

const DotContainer: React.FC<IDotContainerProps> = (props) => {
  const refScrollView = useRef<ScrollView>(null);
  const prevPage = usePrevious(props.curPage);

  const getSizeRatio = useCallback(() => {
    if (!props.sizeRatio) return 1.0;

    return Math.max(1.0, props.sizeRatio);
  }, [props.sizeRatio]);

  const scrollTo = useCallback(
    (index, animated = true) => {
      if (!refScrollView.current) return;

      const sizeRatio = getSizeRatio();
      const FIRST_EMPTY_DOT_SPACE = ONE_EMPTY_DOT_SIZE * 2;
      const MOVE_DISTANCE = ONE_EMPTY_DOT_SIZE * sizeRatio;

      const moveTo = Math.max(
        0,
        FIRST_EMPTY_DOT_SPACE + (index - 3) * MOVE_DISTANCE
      );

      if (props.vertical) {
        refScrollView.current.scrollTo({
          x: 0,
          y: moveTo,
          animated,
        });
        return;
      }

      refScrollView.current.scrollTo({
        x: moveTo,
        y: 0,
        animated,
      });
    },
    [getSizeRatio, props.vertical]
  );

  const getContainerStyle = useMemo<StyleProp<ViewStyle>>(() => {
    const { vertical } = props;
    const sizeRatio = getSizeRatio();
    const containerSize = 84 * sizeRatio;

    return {
      alignItems: 'center',
      flexDirection: vertical ? 'column' : 'row',
      maxHeight: vertical ? containerSize : undefined,
      maxWidth: vertical ? undefined : containerSize,
    };
  }, [getSizeRatio, props]);

  useEffect(() => {
    if (props.maxPage > 4 && prevPage !== props.curPage)
      scrollTo(props.curPage);
  }, [prevPage, props.curPage, props.maxPage, scrollTo]);

  const { curPage, maxPage, activeDotColor } = props;
  const list = useMemo(() => [...Array(maxPage).keys()], [maxPage]);

  let normalizedPage = curPage;
  if (curPage < 0) normalizedPage = 0;

  if (curPage > maxPage - 1) {
    normalizedPage = maxPage - 1;
  }
  const sizeRatio = getSizeRatio();

  if (maxPage < 5) {
    return (
      <View style={getContainerStyle}>
        {list.map((i) => {
          return (
            <Dot
              key={i}
              idx={i}
              sizeRatio={sizeRatio}
              curPage={normalizedPage}
              maxPage={maxPage}
              inActiveDotColor={props.inActiveDotColor}
              activeColor={activeDotColor}
            />
          );
        })}
      </View>
    );
  }

  return (
    <View
      style={getContainerStyle}
      onLayout={() => {
        // scroll to right index on initial render
        scrollTo(props.curPage, false);
      }}
    >
      <ScrollView
        ref={refScrollView}
        contentContainerStyle={styles.contentContainer}
        bounces={false}
        horizontal={!props.vertical}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {/* previous empty dummy dot */}
        <EmptyDot sizeRatio={sizeRatio} />
        <EmptyDot sizeRatio={sizeRatio} />

        {list.map((i) => {
          return (
            <Dot
              sizeRatio={sizeRatio}
              key={i}
              idx={i}
              curPage={normalizedPage}
              maxPage={maxPage}
              inActiveDotColor={props.inActiveDotColor}
              activeColor={activeDotColor}
            />
          );
        })}

        {/* previous empty dummy dot */}
        <EmptyDot sizeRatio={sizeRatio} />
        <EmptyDot sizeRatio={sizeRatio} />
      </ScrollView>
    </View>
  );
};

export default memo(DotContainer);

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
  },
});
