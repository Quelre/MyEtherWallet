import { showNotification as dShowNotification, TShowNotification } from 'actions/notifications';
import {
  initSwap as dInitSwap,
  bityOrderCreateRequestedSwap as dBityOrderCreateRequestedSwap,
  shapeshiftOrderCreateRequestedSwap as dShapeshiftOrderCreateRequestedSwap,
  changeStepSwap as dChangeStepSwap,
  destinationAddressSwap as dDestinationAddressSwap,
  loadBityRatesRequestedSwap as dLoadBityRatesRequestedSwap,
  loadShapeshiftRatesRequestedSwap as dLoadShapeshiftRatesRequestedSwap,
  restartSwap as dRestartSwap,
  startOrderTimerSwap as dStartOrderTimerSwap,
  startPollBityOrderStatus as dStartPollBityOrderStatus,
  stopLoadBityRatesSwap as dStopLoadBityRatesSwap,
  stopOrderTimerSwap as dStopOrderTimerSwap,
  stopPollBityOrderStatus as dStopPollBityOrderStatus,
  TInitSwap,
  TBityOrderCreateRequestedSwap,
  TChangeStepSwap,
  TDestinationAddressSwap,
  TLoadBityRatesRequestedSwap,
  TShapeshiftOrderCreateRequestedSwap,
  TLoadShapeshiftRequestedSwap,
  TRestartSwap,
  TStartOrderTimerSwap,
  TStartPollBityOrderStatus,
  TStopLoadBityRatesSwap,
  TStopOrderTimerSwap,
  TStopPollBityOrderStatus
} from 'actions/swap';
import {
  SwapInput,
  NormalizedOptions,
  NormalizedBityRates,
  NormalizedShapeshiftRates
} from 'reducers/swap/types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import CurrencySwap from './components/CurrencySwap';
import CurrentRates from './components/CurrentRates';
import PartThree from './components/PartThree';
import ReceivingAddress from './components/ReceivingAddress';
import SwapInfoHeader from './components/SwapInfoHeader';
import ShapeshiftBanner from './components/ShapeshiftBanner';
import TabSection from 'containers/TabSection';

interface ReduxStateProps {
  step: number;
  origin: SwapInput;
  destination: SwapInput;
  bityRates: NormalizedBityRates;
  // change
  shapeshiftRates: NormalizedShapeshiftRates;
  options: NormalizedOptions;
  provider: string;
  bityOrder: any;
  destinationAddress: string;
  isFetchingRates: boolean | null;
  secondsRemaining: number | null;
  outputTx: string | null;
  isPostingOrder: boolean;
  bityOrderStatus: string | null;
  shapeshiftOrderStatus: string | null;
  paymentAddress: string | null;
}

interface ReduxActionProps {
  changeStepSwap: TChangeStepSwap;
  loadBityRatesRequestedSwap: TLoadBityRatesRequestedSwap;
  loadShapeshiftRatesRequestedSwap: TLoadShapeshiftRequestedSwap;
  destinationAddressSwap: TDestinationAddressSwap;
  restartSwap: TRestartSwap;
  stopLoadBityRatesSwap: TStopLoadBityRatesSwap;
  shapeshiftOrderCreateRequestedSwap: TShapeshiftOrderCreateRequestedSwap;
  bityOrderCreateRequestedSwap: TBityOrderCreateRequestedSwap;
  startPollBityOrderStatus: TStartPollBityOrderStatus;
  stopOrderTimerSwap: TStopOrderTimerSwap;
  stopPollBityOrderStatus: TStopPollBityOrderStatus;
  showNotification: TShowNotification;
  startOrderTimerSwap: TStartOrderTimerSwap;
  initSwap: TInitSwap;
}

class Swap extends Component<ReduxActionProps & ReduxStateProps, {}> {
  public componentDidMount() {
    const { provider } = this.props;
    if (provider === 'shapeshift') {
      this.props.loadShapeshiftRatesRequestedSwap();
    } else {
      this.props.loadBityRatesRequestedSwap();
    }
  }

  public componentWillUnmount() {
    this.props.stopLoadBityRatesSwap();
  }

  public render() {
    const {
      // STATE
      bityRates,
      shapeshiftRates,
      provider,
      options,
      origin,
      destination,
      destinationAddress,
      step,
      bityOrder,
      secondsRemaining,
      paymentAddress,
      bityOrderStatus,
      shapeshiftOrderStatus,
      isPostingOrder,
      outputTx,
      // ACTIONS
      initSwap,
      restartSwap,
      stopLoadBityRatesSwap,
      changeStepSwap,
      destinationAddressSwap,
      bityOrderCreateRequestedSwap,
      shapeshiftOrderCreateRequestedSwap,
      showNotification,
      startOrderTimerSwap,
      startPollBityOrderStatus,
      stopOrderTimerSwap,
      stopPollBityOrderStatus
    } = this.props;

    const { reference } = bityOrder;

    const ReceivingAddressProps = {
      isPostingOrder,
      origin,
      destinationId: destination.id,
      destinationKind: destination.amount,
      destinationAddressSwap,
      destinationAddress,
      stopLoadBityRatesSwap,
      changeStepSwap,
      provider,
      bityOrderCreateRequestedSwap,
      shapeshiftOrderCreateRequestedSwap
    };

    const SwapInfoHeaderProps = {
      origin,
      destination,
      reference,
      secondsRemaining,
      restartSwap,
      bityOrderStatus,
      shapeshiftOrderStatus
    };

    const CurrencySwapProps = {
      showNotification,
      bityRates,
      shapeshiftRates,
      provider,
      options,
      initSwap,
      changeStepSwap
    };

    const PaymentInfoProps = {
      origin,
      paymentAddress
    };

    const PartThreeProps = {
      ...SwapInfoHeaderProps,
      ...PaymentInfoProps,
      reference,
      provider,
      startOrderTimerSwap,
      startPollBityOrderStatus,
      stopOrderTimerSwap,
      stopPollBityOrderStatus,
      showNotification,
      destinationAddress,
      outputTx
    };

    const { ETHBTC, ETHREP, BTCETH, BTCREP } = shapeshiftRates.byId;
    const CurrentRatesProps = { ETHBTC, ETHREP, BTCETH, BTCREP, provider };

    return (
      <TabSection>
        <section className="Tab-content swap-tab">
          {step === 1 && <CurrentRates {...CurrentRatesProps} />}
          {step === 1 && <ShapeshiftBanner />}
          {(step === 2 || step === 3) && <SwapInfoHeader {...SwapInfoHeaderProps} />}
          <main className="Tab-content-pane">
            {step === 1 && <CurrencySwap {...CurrencySwapProps} />}
            {step === 2 && <ReceivingAddress {...ReceivingAddressProps} />}
            {step === 3 && <PartThree {...PartThreeProps} />}
          </main>
        </section>
      </TabSection>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    step: state.swap.step,
    origin: state.swap.origin,
    destination: state.swap.destination,
    bityRates: state.swap.bityRates,
    shapeshiftRates: state.swap.shapeshiftRates,
    provider: state.swap.provider,
    options: state.swap.options,
    bityOrder: state.swap.bityOrder,
    destinationAddress: state.swap.destinationAddress,
    isFetchingRates: state.swap.isFetchingRates,
    secondsRemaining: state.swap.secondsRemaining,
    outputTx: state.swap.outputTx,
    isPostingOrder: state.swap.isPostingOrder,
    bityOrderStatus: state.swap.bityOrderStatus,
    shapeshiftOrderStatus: state.swap.shapeshiftOrderStatus,
    paymentAddress: state.swap.paymentAddress
  };
}

export default connect(mapStateToProps, {
  changeStepSwap: dChangeStepSwap,
  initSwap: dInitSwap,
  bityOrderCreateRequestedSwap: dBityOrderCreateRequestedSwap,
  shapeshiftOrderCreateRequestedSwap: dShapeshiftOrderCreateRequestedSwap,
  loadBityRatesRequestedSwap: dLoadBityRatesRequestedSwap,
  loadShapeshiftRatesRequestedSwap: dLoadShapeshiftRatesRequestedSwap,
  destinationAddressSwap: dDestinationAddressSwap,
  restartSwap: dRestartSwap,
  startOrderTimerSwap: dStartOrderTimerSwap,
  startPollBityOrderStatus: dStartPollBityOrderStatus,
  stopLoadBityRatesSwap: dStopLoadBityRatesSwap,
  stopOrderTimerSwap: dStopOrderTimerSwap,
  stopPollBityOrderStatus: dStopPollBityOrderStatus,
  showNotification: dShowNotification
})(Swap);
