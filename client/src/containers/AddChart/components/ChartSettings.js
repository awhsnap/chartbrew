import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Form, Segment, Checkbox, Grid, Modal, Button,
  Accordion, Icon, Dropdown, Label, Header,
} from "semantic-ui-react";
import moment from "moment";
import { DateRangePicker } from "react-date-range";

import { secondary, primary } from "../../../config/colors";

function ChartSettings(props) {
  const [initSelectionRange] = useState({
    startDate: moment().startOf("month").toDate(),
    endDate: moment().endOf("month").toDate(),
    key: "selection",
  });
  const [dateRangeModal, setDateRangeModal] = useState(false);
  const [activeOption, setActiveOption] = useState(false);
  const [dateRange, setDateRange] = useState(initSelectionRange);

  const {
    type, pointRadius, displayLegend, subType,
    endDate, currentEndDate, timeInterval,
    includeZeros, startDate, onChange, onComplete,
  } = props;

  useEffect(() => {
    if (startDate) {
      _onViewRange(true, true);
    }
  }, []);

  useEffect(() => {
    setDateRange({ startDate, endDate });
  }, [startDate, endDate]);

  const _onViewRange = (value, init) => {
    if (!value) {
      onChange({ dateRange: { startDate: null, endDate: null } });
    }

    let isModalOpen = value;
    if (init) {
      isModalOpen = false;
    }

    setDateRangeModal(isModalOpen);
  };

  const _onActivateRange = (checked) => {
    if (!checked) {
      _onViewRange(false);
      return;
    }

    if (startDate == null || endDate == null) {
      _onViewRange(true);
    }
  };

  const _onAddPoints = (value) => {
    onChange({ pointRadius: value });
  };

  const _onChangeDateRange = (range) => {
    const startDate = moment(range.selection.startDate).toDate();
    const endDate = moment(range.selection.endDate).toDate();
    setDateRange({ startDate, endDate });
  };

  const _onComplete = () => {
    const { startDate, endDate } = dateRange;
    onChange({ dateRange: { startDate, endDate } });

    setDateRangeModal(false);

    onComplete();
  };

  const _onChangeActiveOption = (option) => {
    if (activeOption === option) {
      setActiveOption(false);
    } else {
      setActiveOption(option);
    }
  };

  return (
    <div style={styles.container}>
      <Header dividing size="small">Chart Settings</Header>
      <Accordion fluid styled>
        {subType && subType.toLowerCase().indexOf("timeseries") > -1
          && (
            <>
              <Accordion.Title
                active={activeOption === "daterange"}
                onClick={() => _onChangeActiveOption("daterange")}
              >
                <Icon name="dropdown" />
                Date settings
              </Accordion.Title>
              <Accordion.Content active={activeOption === "daterange"}>
                <Form>
                  <Form.Group widths="equal" style={{ paddingBottom: 20 }}>
                    <Form.Field>
                      <Button
                        content="Date filter"
                        primary
                        icon="calendar"
                        labelPosition="right"
                        onClick={() => _onViewRange(true)}
                      />
                      <Checkbox
                        checked={startDate != null || endDate != null}
                        onChange={(e, data) => _onActivateRange(data.checked)}
                        style={{ ...styles.accordionToggle, ...styles.inlineCheckbox }}
                      />
                      <div style={{ marginTop: 5 }}>
                        {startDate && (
                          <Label
                            color="olive"
                            as="a"
                            onClick={() => setDateRangeModal(true)}
                          >
                            {moment(startDate).format("ll")}
                          </Label>
                        )}
                        {startDate && (<span> to </span>)}
                        {endDate && (
                          <Label
                            color="olive"
                            as="a"
                            onClick={() => setDateRangeModal(true)}
                          >
                            {moment(endDate).format("ll")}
                          </Label>
                        )}
                      </div>
                    </Form.Field>
                    <Form.Field>
                      <Checkbox
                        label="Keep current date as end date"
                        toggle
                        checked={currentEndDate}
                        disabled={!dateRange.endDate}
                        onChange={() => {
                          onChange({ currentEndDate: !currentEndDate });
                        }}
                        style={styles.accordionToggle}
                      />
                    </Form.Field>
                  </Form.Group>
                  <Form.Group widths="equal">
                    <Form.Field>
                      <label>Time interval</label>
                      <Dropdown
                        placeholder="Select the frequency"
                        selection
                        options={[{
                          text: "Hourly",
                          value: "hour",
                        }, {
                          text: "Daily",
                          value: "day",
                        }, {
                          text: "Weekly",
                          value: "week",
                        }, {
                          text: "Monthly",
                          value: "month",
                        }, {
                          text: "Yearly",
                          value: "year",
                        }]}
                        value={timeInterval || "day"}
                        onChange={(e, data) => onChange({ timeInterval: data.value })}
                      />
                    </Form.Field>
                    <Form.Field>
                      <label>Show zeros</label>
                      <Checkbox
                        label="Allow zero dates"
                        toggle
                        checked={includeZeros}
                        onChange={() => onChange({ includeZeros: !includeZeros })}
                      />
                    </Form.Field>
                  </Form.Group>
                </Form>
              </Accordion.Content>
            </>
          )}
        <Accordion.Title
          active={activeOption === "dataset"}
          onClick={() => _onChangeActiveOption("dataset")}
        >
          <Icon name="dropdown" />
          Dataset global settings
        </Accordion.Title>
        <Accordion.Content active={activeOption === "dataset"}>
          <Form>
            <Form.Group widths="equal">
              {type === "line"
                && (
                  <Form.Field>
                    <Checkbox
                      label="Add data points"
                      toggle
                      checked={pointRadius > 0}
                      onChange={() => {
                        if (pointRadius > 0) {
                          _onAddPoints(0);
                        } else {
                          _onAddPoints(3);
                        }
                      }}
                      style={styles.accordionToggle}
                    />
                  </Form.Field>
                )}
              <Form.Field>
                <Checkbox
                  label="Add legend"
                  toggle
                  checked={displayLegend}
                  onChange={() => onChange({ displayLegend: !displayLegend })}
                  style={styles.accordionToggle}
                />
              </Form.Field>
            </Form.Group>
          </Form>
        </Accordion.Content>
      </Accordion>

      <Modal
        size="small"
        basic
        open={dateRangeModal}
        onClose={() => setDateRangeModal(false)}
      >
        <Modal.Header>Set a custom date range for your chart</Modal.Header>
        <Modal.Content>
          <Grid centered padded>
            <Segment textAlign="center" compact>
              <DateRangePicker
                direction="horizontal"
                rangeColors={[secondary, primary]}
                ranges={[
                  dateRange.startDate && dateRange.endDate ? {
                    startDate: moment(dateRange.startDate).toDate(),
                    endDate: moment(dateRange.endDate).toDate(),
                    key: "selection",
                  } : initSelectionRange
                ]}
                onChange={_onChangeDateRange}
              />
            </Segment>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Button
            basic
            inverted
            icon="x"
            labelPosition="right"
            content="Cancel"
            onClick={() => setDateRangeModal(false)}
          />
          <Button
            color="blue"
            inverted
            icon="checkmark"
            labelPosition="right"
            content="Apply date filter"
            onClick={_onComplete}
          />
        </Modal.Actions>
      </Modal>
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
  },
  accordionToggle: {
    marginTop: 0,
  },
  inlineCheckbox: {
    verticalAlign: "middle",
    marginLeft: 10,
  },
};

ChartSettings.defaultProps = {
  subType: "",
  displayLegend: false,
  pointRadius: 0,
  startDate: null,
  endDate: null,
  includeZeros: true,
  currentEndDate: false,
  timeInterval: "day",
  onChange: () => { },
  onComplete: () => { },
};

ChartSettings.propTypes = {
  type: PropTypes.string.isRequired,
  subType: PropTypes.string,
  displayLegend: PropTypes.bool,
  pointRadius: PropTypes.number,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  includeZeros: PropTypes.bool,
  currentEndDate: PropTypes.bool,
  timeInterval: PropTypes.string,
  onChange: PropTypes.func,
  onComplete: PropTypes.func,
};

export default ChartSettings;
