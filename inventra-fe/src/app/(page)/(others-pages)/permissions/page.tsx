'use client'
import ToggleSwitch from '@/components/form/form-elements/ToggleSwitch'
import Switch from '@/components/form/switch/Switch'
import React, { useEffect, useState } from 'react'




const PermissionsPage = () => {

    const [pTemp, setpTemp] = useState<string[]>([])
    const [sButton, setsButton] = useState(false)

    const data = [
        {
            label: "data1",
            data: [{
                label: "button1", value: "button1"
            }, {
                label: "button2", value: "button2"
            }],

        },
        {
            label: "data2",
            data: [{
                label: "button3", value: "button3"
            }, {
                label: "button4", value: "button4"
            }]
        }
    ]




    useEffect(() => {
        console.log(pTemp)
        console.log(sButton)
    }, [pTemp, sButton])

    const isChecked = (value: string) => pTemp.includes(value)

    const allValues = (item: typeof data[0]) => item.data.map(i => i.value)

    return (
        <>
            {data.map((item, index) => (
                <div key={index}>
                    <Switch
                        label={item.label}
                        checked={allValues(item).every(isChecked)}
                        onChange={(checked) => {
                            const values = allValues(item)
                            setpTemp(prev =>
                                checked
                                    ? [...prev.filter(v => !values.includes(v)), ...values]
                                    : prev.filter(v => !values.includes(v))
                            )
                        }}
                    />
                    <div className='ml-10'>
                        {item.data.map((i, idx) => (
                            <Switch
                                key={idx}
                                label={i.label}
                                checked={isChecked(i.value)}
                                onChange={(checked) => {
                                    setpTemp(prev =>
                                        checked
                                            ? [...prev, i.value]
                                            : prev.filter(v => v !== i.value)
                                    )
                                }}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </>
    )
}

export default PermissionsPage