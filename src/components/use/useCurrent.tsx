import React, { FC, useState, useEffect, useRef } from 'react';
import { useMappedState, useDispatch } from 'redux-react-hook';

type useCurrentProps = (_state: any) => any;

const useCurrent: useCurrentProps = (_state) => {
    const ref = useRef(_state);
    const [state, setstate] = useState(_state);

    useEffect(() => {
        ref.current = state;
    }, [state]);

    return [state, setstate, ref];
};

type useMapCurrentProps = (_state: any) => any;

const useMapCurrent: useMapCurrentProps = (_state) => {
    const ref = useRef(null);
    // redux的数据
    const state = useMappedState((state) => state[_state]);
    useEffect(() => {
        ref.current = state;
    }, [state]);
    return ref;
};

export { useCurrent, useMapCurrent };
