import React, { Component } from 'react';
import { Text, View, Dimensions, Image } from "react-native";
import moment from "moment";

import { VictoryLine, VictoryBar, VictoryLabel, VictoryChart, VictoryClipContainer, VictoryPortal, VictoryTooltip, VictoryAxis, VictoryScatter, VictoryVoronoiContainer, VictoryGroup } from "victory-native";

const deviceWidth = Dimensions.get('window').width;

export default class DailyWeather extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
            result: [],
            dayArray: [],
            maxTemp: [],
            maxTempLabel: [],
            minTemp: [],
            minTempLabel: [],
            weather: {}
        }
    }

    async componentDidMount() {
        // await this._getThePropsData();
    }

    componentDidUpdate=async (prevProps,prevState)=>{
        if(this.props !== prevProps){
            await this._getThePropsData();
        }
    }

    _getThePropsData = () => {
        let theData = this.props && this.props.data;
        let todayWeather = this.props && this.props.todayWeather;

        const result = theData && theData.filter((thing, index, self) =>
            index === self.findIndex((t) => (
                moment(t.dt * 1000).format("ddd") === moment(thing.dt * 1000).format("ddd")
            ))
        );

        let dayArray = [];
        let maxTemp = [];
        let maxTempLabel = [];

        let minTemp = [];
        let minTempLabel = [];

        let weather = {};

        result && result.map(item => {
            dayArray.push(moment(item.dt * 1000).format("ddd"))

            var maxValue = Math.floor(item.temp.max) && Math.floor(item.temp.max)
            var minValue = Math.floor(item.temp.min) && Math.floor(item.temp.min)
            maxTemp.push(maxValue);
            minTemp.push(minValue);

            maxTempLabel.push(`${Math.floor(item.temp.max)} °C`);
            minTempLabel.push(`${Math.floor(item.temp.min)} °C`);

            weather = item.weather[0];

        })

        this.setState({
            result,
            dayArray,
            maxTemp,
            maxTempLabel,
            minTemp,
            minTempLabel,
            weather
        })
    };


    render() {

        const { result, dayArray, maxTemp, maxTempLabel, minTemp, minTempLabel, weather } = this.state;

        return (

            <View style={{ padding: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                borderRadius: 10,
                margin: 10,
                alignItems: 'center',
                justifyContent: 'space-evenly',
                width: deviceWidth - 20,
                maxWidth: 478 }}>


                <VictoryChart width={deviceWidth - 20}>
                    <VictoryAxis
                        style={{
                            axis: {stroke: "transparent"},
                            axisLabel: {fontSize: 20, padding: 30, color: 'red'},
                            // ticks: {stroke: "grey", size: 5},
                            // tickLabels: {fontSize: 15, padding: 5}
                        }}
                        fixLabelOverlap={true} dependentAxis={false} orientation="top"
                        tickValues={dayArray}/>

                      <VictoryGroup  domainPadding={{x: [200, -40], y: [30, 30]}} >

                          <VictoryScatter
                              style={{
                                  parent: {
                                      border: "1px solid #ccc"
                                  },
                                  data: {
                                      fill: "#c43a31", fillOpacity: 0.6, stroke: "#c43a31", strokeWidth: 0.5
                                  },
                                  labels: {
                                      fontSize: 11, fill: "#c43a31"
                                  }
                              }}
                              size={5}
                              data={maxTemp}
                              labels={maxTempLabel}
                              labelComponent={
                                  <VictoryLabel style={{ fill: "white", fontSize: 10 }} dy={-20}/>
                              }
                          />

                          <VictoryScatter
                              style={{
                                  parent: {
                                      border: "1px solid #ccc"
                                  },
                                  data: {
                                      fill: "#c43a31", fillOpacity: 0.6, stroke: "#c43a31", strokeWidth: 0.5
                                  },
                                  labels: {
                                      fontSize: 11, fill: "#c43a31"
                                  }
                              }}
                              size={5}
                              data={minTemp}
                              labels={minTempLabel}
                              labelComponent={
                                  <VictoryLabel style={{ fill: "white", fontSize: 10 }} dy={20}/>
                              }
                          />


                     </VictoryGroup>



                </VictoryChart>


                <View style={{ width: deviceWidth, flexDirection: 'row', justifyContent: 'space-evenly', paddingBottom: 20, paddingHorizontal: 25}}>
                    {
                        result && result.map((item, index) => {
                            return <View key={index} style={{
                                textAlign: 'center',
                                alignItems: 'center'
                            }}>
                                <Image style={{
                                    width: 30,
                                    height: 30
                                }}
                                       source={{
                                           uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
                                       }}
                                       resizeMode={"contain"} // cover or contain its upto you view look
                                />
                                <Text style={{ width: 50, fontSize: 10, textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>{item.weather[0].description}</Text>
                            </View>
                        })
                    }

                </View>

            </View>

        );

    }
};