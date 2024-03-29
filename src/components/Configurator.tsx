import { Factory, TokenId } from "diploma-core";
import { ReactNode, useEffect, useMemo, useReducer, useState } from "react";
import {
  SearchRouterInputs,
  SearchRouterOutputs,
} from "~/server/api/routers/search";
import { api } from "~/utils/api";
import { Header, Suberror, Subtext } from "./ui";
import { ZodError, z } from "zod";

const capFormatter = Intl.NumberFormat("en-US", {
  maximumFractionDigits: 4,
  currency: "USD",
  style: "currency",
  notation: "compact",
});

export const Item = ({
  children,
  enabled,
  ...args
}: {
  children?: ReactNode;
  title?: string;
  enabled?: boolean;
  onClick?: () => void;
}) => {
  return (
    <div
      className={`w-60 cursor-pointer select-none rounded border border-sky-500 p-2 text-center ${
        enabled ? "bg-sky-500 text-white" : ""
      }`}
      {...args}
    >
      {children}
    </div>
  );
};

type Config = SearchRouterInputs["doSearch"] | undefined;
type Action =
  | {
      type: "setConfig";
      payload: Config;
    }
  | {
      type: `toggleToken`;
      payload: TokenId;
    }
  | {
      type: `toggleFactory`;
      payload: Factory;
    }
  | {
      type: `toggleCapital`;
      payload: bigint;
    }
  | {
      type: "toggleReloadContracts";
    }
  | {
      type: "setBlock";
      payload: number | "latest";
    };

const configReducer = (state: Config, action: Action): Config => {
  if (action.type === "setConfig") {
    return action.payload;
  }
  if (!state) {
    return undefined;
  }
  if (action.type === "toggleFactory") {
    const fSet = new Set(state.usedFactories);
    if (fSet.has(action.payload)) {
      fSet.delete(action.payload);
    } else {
      fSet.add(action.payload);
    }
    return {
      ...state,
      usedFactories: [...fSet],
    };
  }
  if (action.type === "toggleCapital") {
    const fSet = new Set(state.capsSet);
    if (fSet.has(action.payload)) {
      fSet.delete(action.payload);
    } else {
      fSet.add(action.payload);
    }
    return {
      ...state,
      capsSet: [...fSet],
    };
  }
  if (action.type === "toggleToken") {
    const fSet = new Set(state.usedTokens);
    if (fSet.has(action.payload)) {
      fSet.delete(action.payload);
    } else {
      fSet.add(action.payload);
    }
    return {
      ...state,
      usedTokens: [...fSet],
    };
  }
  if (action.type === "toggleReloadContracts") {
    return {
      ...state,
      reloadContracts: !state.reloadContracts,
    };
  }
  if (action.type === "setBlock") {
    return {
      ...state,
      blockNumber: action.payload,
    };
  }
  throw new Error("invalid action type");
};

const isConfigValid = (
  config: Config,
  baseConfig: SearchRouterOutputs["getConfig"]
) => {
  const ConfigScheme = z.object({
    reloadContracts: z.oboolean(),
    blockNumber: z.union([z.literal("latest"), z.number().int().positive()]),
    capsSet: z.bigint().array().nonempty(),
    usedTokens: z
      .enum(
        baseConfig.availableTokens.map((t) => t.id) as [string, ...string[]]
      )
      .array()
      .nonempty(),
    usedFactories: z.enum(baseConfig.availableFactories).array().nonempty(),
  });

  return ConfigScheme.safeParse(config);
};

export const Configurator = ({
  setConfig,
  disabled,
}: {
  config?: SearchRouterInputs["doSearch"];
  setConfig: (config: SearchRouterInputs["doSearch"] | undefined) => void;
  disabled?: boolean;
}) => {
  const { data: baseConfig, error } = api.search.getConfig.useQuery(
    {},
    {
      onSuccess: (data) =>
        state ??
        dispatch({
          type: "setConfig",
          payload: {
            reloadContracts: true,
            usedTokens: data.availableTokens.map((t) => t.id),
            usedFactories: data.availableFactories as unknown as Factory[],
            capsSet: data.capsSet as unknown as bigint[],
            blockNumber: "latest",
          },
        }),
    }
  );

  const [state, dispatch] = useReducer(configReducer, undefined);

  const [validationError, setValidationError] = useState<ZodError<Config>>();

  useEffect(() => {
    if (state && baseConfig) {
      const valid = isConfigValid(state, baseConfig);
      if (valid.success) {
        setConfig(state);
        setValidationError(undefined);
      } else {
        setConfig(undefined);
        setValidationError(valid.error);
      }
    }
  }, [state]);

  if (error) {
    return <div>Error {error.message}</div>;
  }

  if (!baseConfig) {
    return <div>Loading...</div>;
  }

  const fErrors = validationError?.formErrors.fieldErrors;

  return (
    <div className={disabled ? "pointer-events-none opacity-30" : ""}>
      <Header>
        Block number:{" "}
        {fErrors?.blockNumber && <Suberror>({fErrors.blockNumber})</Suberror>}
      </Header>
      <div className="flex w-auto justify-around gap-1 pb-2">
        <Item
          enabled={state?.blockNumber === "latest"}
          onClick={() =>
            dispatch({
              type: "setBlock",
              payload: "latest",
            })
          }
          title="best performance"
        >
          latest
        </Item>
        <input
          type="number"
          className="w-60 cursor-pointer select-none rounded border border-sky-500 p-2 text-center"
          placeholder="custom"
          value={
            typeof state?.blockNumber === "number" ? state.blockNumber : ""
          }
          onInput={(e) =>
            dispatch({
              type: "setBlock",
              payload: e.currentTarget.valueAsNumber,
            })
          }
          title="reduced performance"
        />
      </div>
      {/* <div className="text-xl">Reload contracts?:</div>
      <div className="flex gap-2 pb-2 text-xl">
        <Item>Yes</Item>
        <Item>No</Item>
      </div> */}
      <Header>
        Factories: <Subtext>({state?.usedFactories?.length} selected)</Subtext>{" "}
        {fErrors?.usedFactories && (
          <Suberror>({fErrors.usedFactories})</Suberror>
        )}
      </Header>
      <div className="flex w-auto justify-between gap-1 pb-2">
        {baseConfig.availableFactories.map((f) => (
          <Item
            enabled={state?.usedFactories?.includes(f)}
            onClick={() =>
              dispatch({
                type: "toggleFactory",
                payload: f,
              })
            }
          >
            {f}
          </Item>
        ))}
      </div>
      <Header>
        Token: <Subtext>({state?.usedTokens?.length} selected)</Subtext>{" "}
        {fErrors?.usedTokens && <Suberror>({fErrors.usedTokens})</Suberror>}
      </Header>
      <div className="flex w-auto justify-between gap-1 pb-2">
        {baseConfig.availableTokens.map((t) => (
          <Item
            title={`${t.description} ~ ${t.inDollars}$`}
            enabled={state?.usedTokens?.includes(t.id)}
            onClick={() =>
              dispatch({
                type: "toggleToken",
                payload: t.id,
              })
            }
          >
            {t.id}
          </Item>
        ))}
      </div>
      <Header>
        Capitals: <Subtext>({state?.capsSet?.length} selected)</Subtext>{" "}
        {fErrors?.capsSet && <Suberror>({fErrors.capsSet})</Suberror>}
      </Header>
      <div className="flex w-auto justify-between gap-1">
        {baseConfig.capsSet.map((c) => (
          <Item
            title={`${c} TBH`}
            enabled={state?.capsSet?.includes(c)}
            onClick={() =>
              dispatch({
                type: "toggleCapital",
                payload: c,
              })
            }
          >
            {capFormatter.format(c / 10n ** 18n)}
          </Item>
        ))}
      </div>
    </div>
  );
};
