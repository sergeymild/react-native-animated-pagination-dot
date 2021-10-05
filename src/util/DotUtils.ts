import { useEffect, useRef } from 'react';

type IDotStyle = {
  size: number;
  opacity: number;
};

enum EnumDotType {
  ACTIVE,
  INACTIVE,
  MEDIUM,
  SMALL,
}

const DotStyle = {
  [EnumDotType.INACTIVE]: {
    size: 8,
    opacity: 0.2,
  },
  [EnumDotType.ACTIVE]: {
    size: 8,
    opacity: 1.0,
  },
  [EnumDotType.MEDIUM]: {
    size: 5,
    opacity: 0.2,
  },
  [EnumDotType.SMALL]: {
    size: 3,
    opacity: 0.2,
  },
};

export type getDotStylePayload = {
  idx: number;
  curPage: number;
  maxPage: number;
};

export const getDotStyle = ({
  idx,
  curPage,
  maxPage,
}: getDotStylePayload): IDotStyle => {
  let type = EnumDotType.SMALL;

  if (maxPage < 5) {
    // return ( idx === curPage ) ? EnumDotType.ACTIVE : EnumDotType.INACTIVE;
    return DotStyle[
      idx === curPage ? EnumDotType.ACTIVE : EnumDotType.INACTIVE
    ];
  }

  if (curPage < 3) {
    //If the current page is 3 or less, a separate array is specified.
    if (idx < 3) {
      type = EnumDotType.INACTIVE;
      if (curPage === idx) {
        type = EnumDotType.ACTIVE;
      }
    } else if (idx < 4) {
      type = EnumDotType.MEDIUM;
    } else {
      type = EnumDotType.SMALL;
    }
  } else if (curPage === 3) {
    if (idx < 4) {
      if (idx === 0) {
        type = EnumDotType.MEDIUM;
      } else {
        type = EnumDotType.INACTIVE;

        if (curPage === idx) {
          type = EnumDotType.ACTIVE;
        }
      }
    } else if (curPage + 1 === idx) {
      type = EnumDotType.MEDIUM;
    } else {
      type = EnumDotType.SMALL;
    }
  } else {
    // so that return to the same logic
    if (idx > curPage) {
      if (idx === curPage + 1) {
        type = EnumDotType.MEDIUM;
      }
    } else if (idx < curPage) {
      if (idx >= curPage - 2) {
        type = EnumDotType.INACTIVE;
      } else if (idx === curPage - 3) {
        type = EnumDotType.MEDIUM;
      }
    } else {
      type = EnumDotType.ACTIVE;
    }
  }

  return DotStyle[type];
};

export function usePrevious<T>(state: T) {
  const ref = useRef<T>();
  useEffect(function () {
    ref.current = state;
  });
  return ref.current;
}
