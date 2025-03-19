import { Card, Button, List } from "flowbite-react";
import React from 'react'
import logo from '../assets/truck-red-converted-bdbe7b1994e04d9723fe6301a0608409f3f3a40cc45c821455354c3ec2cf4425.webp'
import { useNavigate } from "react-router";

const CardComp = ({ log }) => {
    const navigate = useNavigate()
  return (
    <Card
      className="max-w-sm w-56 h-56"
      imgAlt="log sheet"
    >
      <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
      {log.date}
      </h5>
      <List unstyled>
        <List.Item>{log.driver_name}</List.Item>
        <List.Item>{log.carrier_name} </List.Item>
        <List.Item>{log.truck_number}</List.Item>
    </List>
      <Button size="xs" color="blue" onClick={() => navigate(`/eld-log-pdf/${log.id}`)}>View log sheet</Button>
    </Card>
  )
}

export default CardComp