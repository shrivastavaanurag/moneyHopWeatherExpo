import React, {Component} from "react";
import {View, Text, Image, TouchableOpacity} from 'react-native'
import moment from "moment/moment";

export default class TodayWeather extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showData: false
        }
    }


    pad = num => ("0" + num).slice(-2);

    getTimeFromDate = timestamp => {
        // const date = new Date(timestamp * 1000);
        const date = moment(timestamp * 1000).utcOffset('+05:30').format('hh:mm:ss ');
        /*let hours = date.getHours(),
            minutes = date.getMinutes(),
            seconds = date.getSeconds();*/
        // return this.pad(hours) + ":" + this.pad(minutes) // + ":" + this.pad(seconds)
        return date;
    };

    _renderItem = (title, value, lastString) => {
        return <View style={{ width: '35%' }}>
            <Text style={{fontSize: 18}}>{title}</Text>
            <Text style={{color: 'black', fontSize: 15 }}>
                {value + lastString}
            </Text>
        </View>
    };

    render() {

        const { currentWeather, timezone } = this.props;

        Object.keys(currentWeather).length > 0 && console.log('==> \n ', currentWeather)

        return (
            Object.keys(currentWeather).length > 0 &&
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <View style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: 20,
                    width: '95%',
                    maxWidth: 478,
                    paddingHorizontal: 20
                }}>

                    <View style={{ height: 20 }} />

                    <View style={{
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-between',
                        color: 'black',
                        padding: 10
                    }}>

                        {this._renderItem("Minimum", currentWeather.daily && Math.round(currentWeather.daily[0].temp.min), ' °C')}
                        {this._renderItem("Maximum", currentWeather.daily && Math.round(currentWeather.daily[0].temp.max), ' °C')}

                    </View>

                    {
                        this.state.showData ?
                            <>
                                <View style={{
                                    flexDirection: 'row',
                                    width: '100%',
                                    justifyContent: 'space-between',
                                    color: 'black',
                                    padding: 10
                                }}>
                                    {this._renderItem("Real feel", currentWeather.current && Math.round(currentWeather.current.feels_like), ' °C')}
                                    {this._renderItem("Wind", currentWeather.current && currentWeather.current.wind_speed, ' m/s')}

                                </View>

                                <View style={{
                                    flexDirection: 'row',
                                    width: '100%',
                                    justifyContent: 'space-between',
                                    color: 'black',
                                    padding: 10
                                }}>
                                    {this._renderItem("Humidity", currentWeather.current && currentWeather.current.humidity, ' %')}
                                    {this._renderItem("Rain", (currentWeather.daily > 0 ? currentWeather.daily[0].rain : "0"), ' mm')}

                                </View>

                                <View style={{
                                    flexDirection: 'row',
                                    width: '100%',
                                    justifyContent: 'space-between',
                                    color: 'black',
                                    padding: 10
                                }}>
                                    {this._renderItem("Sunrise", currentWeather.current && this.getTimeFromDate(currentWeather.current.sunrise), '')}
                                    {this._renderItem("Sunset", currentWeather.current && this.getTimeFromDate(currentWeather.current.sunset), '')}

                                </View>

                                <View style={{
                                    flexDirection: 'row',
                                    width: '100%',
                                    justifyContent: 'space-between',
                                    color: 'black',
                                    padding: 10
                                }}>
                                    {this._renderItem("Sunrise", currentWeather.current && currentWeather.current.pressure, 'mbar')}

                                </View>
                            </>
                            : null
                    }


                    <TouchableOpacity style={{ paddingVertical: 20 }} onPress={() => this.setState({ showData: !this.state.showData }) }>
                        <Text>{this.state.showData ? 'Show Less' : 'Show More...'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
};