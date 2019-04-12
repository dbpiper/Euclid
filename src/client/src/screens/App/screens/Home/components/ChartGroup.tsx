import React from 'react';
import styled from 'styled-components';

import textColor from 'App/shared/styles/text-color';
import SelectedTickerChart from '../containers/SelectedTickerChart';
import TimeWindow from '../shared/TimeWindow';

const ChartSection = styled.section`
  background-color: #111111;
  width: 60%;
  height: 100%;
  margin: auto;
  display: block;
`;

const ChartBody = styled.div`
  width: 730px;
  height: 250px;
  margin: auto;
  padding-top: 10%;
`;

const HeaderContainer = styled.section`
  display: flex;
  justify-content: flex-end;
`;

const Header = styled.span`
  margin-right: 1.9rem;
  ${textColor}
`;

const LinkButton = styled.button`
  background: none !important;
  color: inherit;
  border: none;
  padding: 0 !important;
  font: inherit;
  /* border-bottom: 1px solid #444444; */
  border-bottom: 1px solid #5a5a5a;
  /* border-bottom: 1px solid #c0bebb; */
  /* border-bottom: 1px solid #c0bebb; */
  cursor: pointer;
  margin: 0.5rem;
`;

interface ChartGroupProps {
  getDateTime?: () => number;
  timeWindow?: string;
}

interface IChartGroupState {
  timeWindow: string;
}

class ChartGroup extends React.Component<ChartGroupProps, IChartGroupState> {
  constructor(props: ChartGroupProps) {
    super(props);
    this.state = {
      timeWindow: TimeWindow.ThreeYears,
    };
  }

  public funcSetTimeWindow(newTimeWindow: string) {
    return () =>
      this.setState({
        timeWindow: newTimeWindow,
      });
  }

  public render() {
    const { getDateTime } = this.props;
    const { timeWindow } = this.state;
    // tslint:disable no-unsafe-any
    // disabling because we don't have a working typing for
    // connect from react-redux which breaks SelectedTickerChart
    return (
      <ChartSection>
        <ChartBody>
          <HeaderContainer>
            <Header>
              <LinkButton onClick={this.funcSetTimeWindow(TimeWindow.YTD)}>
                YTD
              </LinkButton>
              <LinkButton
                onClick={this.funcSetTimeWindow(TimeWindow.SixMonths)}
              >
                6 Months
              </LinkButton>
              <LinkButton onClick={this.funcSetTimeWindow(TimeWindow.OneYear)}>
                1 Year
              </LinkButton>
              <LinkButton
                onClick={this.funcSetTimeWindow(TimeWindow.ThreeYears)}
              >
                3 Years
              </LinkButton>
              <LinkButton
                onClick={this.funcSetTimeWindow(TimeWindow.FiveYears)}
              >
                5 Years
              </LinkButton>
              <LinkButton onClick={this.funcSetTimeWindow(TimeWindow.AllTime)}>
                All Time
              </LinkButton>
            </Header>
          </HeaderContainer>
          <SelectedTickerChart
            timeWindow={timeWindow}
            getDateTime={getDateTime}
          />
        </ChartBody>
      </ChartSection>
    );
    // tslint:enable no-unsafe-any
  }
}

export default ChartGroup;
