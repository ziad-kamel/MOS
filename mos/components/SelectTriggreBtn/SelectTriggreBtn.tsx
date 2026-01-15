import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectTriggerBtn({label, items}:{label:string, items: {itemText:string, itemValue:string}[]}) {
  return (
    <Select>
      <SelectTrigger className="w-45">
        <SelectValue placeholder={`Select a ${label}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {items.map((item,index)=>(
              <SelectItem key={index} value={item.itemValue}>
                {item.itemText}
              </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
